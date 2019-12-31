import typescript from "typescript";
import { NodePath } from "@babel/core";
import * as BabelTypes from "@babel/types";
import { InternalError } from "@magical-types/errors";
import { Project } from "ts-morph";
import { convertType, getPropTypesType } from "@magical-types/convert-type";
import { MagicalNode, MagicalNodeIndex } from "@magical-types/types/src";
import { serializeNodes } from "./serialize";
import * as fs from "fs-extra";
import path from "path";

export function getTypes(
  filename: string,
  things: Map<
    number,
    Map<
      number,
      | {
          exportName: "PropTypes" | "FunctionTypes" | "RawTypes";
          path: NodePath<BabelTypes.JSXOpeningElement>;
        }
      | { exportName: "getNode"; path: NodePath<BabelTypes.CallExpression> }
    >
  >,
  numOfThings: number,
  babelProgram: NodePath<BabelTypes.Program>,
  writeToFs: boolean
) {
  let configFileName = typescript.findConfigFile(
    filename,
    typescript.sys.fileExists
  );
  if (!configFileName) {
    throw new Error("No tsconfig.json file could be found");
  }
  const project = new Project({
    tsConfigFilePath: configFileName,
    addFilesFromTsConfig: false
  });
  project.addExistingSourceFile(filename);
  project.resolveSourceFileDependencies();

  let sourceFile = project.getSourceFileOrThrow(filename).compilerNode;
  let typeChecker = project.getTypeChecker().compilerObject;

  let rootNodes: MagicalNode[] = [];
  let callbacks: ((
    nodesArrayReference: string,
    index: MagicalNodeIndex
  ) => void)[] = [];

  let insertNode = (
    node: MagicalNode,
    cb: (nodesArrayReference: string, index: MagicalNodeIndex) => void
  ) => {
    rootNodes.push(node);
    callbacks.push(cb);
  };

  let num = 0;
  let visit = (node: typescript.Node) => {
    typescript.forEachChild(node, node => {
      let map = things.get(node.getStart());

      if (map) {
        const val = map.get(node.end);
        if (val) {
          num++;
          if (val.exportName !== "getNode") {
            if (!typescript.isJsxOpeningLikeElement(node.parent)) {
              throw new InternalError("not jsx opening element");
            }
            let jsxOpening = node.parent;
            let type: typescript.Type;
            if (
              val.exportName === "PropTypes" ||
              val.exportName === "FunctionTypes"
            ) {
              let componentAttrib = jsxOpening.attributes.properties.find(
                x =>
                  typescript.isJsxAttribute(x) &&
                  x.name.escapedText ===
                    (val.exportName === "PropTypes" ? "component" : "function")
              );
              if (
                !(
                  componentAttrib &&
                  typescript.isJsxAttribute(componentAttrib) &&
                  componentAttrib.initializer &&
                  typescript.isJsxExpression(componentAttrib.initializer) &&
                  componentAttrib.initializer.expression
                )
              ) {
                throw new InternalError("could not find component attrib");
              }
              let nodeForType = componentAttrib.initializer.expression;

              let symbol = typeChecker.getSymbolAtLocation(nodeForType);

              if (!symbol) {
                throw new InternalError("could not find symbol");
              }
              type = typeChecker.getTypeOfSymbolAtLocation(
                symbol,
                symbol.valueDeclaration || symbol.declarations![0]
              );

              if (val.exportName === "PropTypes") {
                type = getPropTypesType(type);
              }
            } else {
              if (!jsxOpening.typeArguments) {
                throw new InternalError("no type arguments on RawTypes");
              }
              if (!jsxOpening.typeArguments[0]) {
                throw new InternalError("no type argument on RawTypes");
              }
              type = typeChecker.getTypeFromTypeNode(
                jsxOpening.typeArguments[0]
              );
            }
            let converted = convertType(type, []);
            insertNode(converted, (nodesArrayReference, index) => {
              val.path.node.attributes.push(
                BabelTypes.jsxAttribute(
                  BabelTypes.jsxIdentifier("__typeIndex"),
                  BabelTypes.jsxExpressionContainer(
                    BabelTypes.numericLiteral(index)
                  )
                ),
                BabelTypes.jsxAttribute(
                  BabelTypes.jsxIdentifier("__types"),
                  BabelTypes.jsxExpressionContainer(
                    BabelTypes.identifier(nodesArrayReference)
                  )
                )
              );
            });
          } else if (val.exportName === "getNode") {
            if (!typescript.isCallExpression(node.parent)) {
              throw new InternalError("not call expression for getNode");
            }
            let callExpression = node.parent;
            let type = typeChecker.getTypeFromTypeNode(
              callExpression.typeArguments![0]
            );
            let converted = convertType(type, []);

            insertNode(converted, (nodesArrayReference, index) => {
              val.path.node.arguments.push(
                BabelTypes.identifier(nodesArrayReference),
                BabelTypes.numericLiteral(index)
              );
            });
          } else {
            throw new InternalError("unexpected node type");
          }
        }
      }

      visit(node);
    });
  };
  visit(sourceFile);
  if (num !== numOfThings) {
    throw new InternalError("num !== numOfThings");
  }
  let { nodes, nodesToIndex } = serializeNodes(rootNodes);
  let id = babelProgram.scope.generateUidIdentifier();
  if (writeToFs) {
    let relative = path.join(
      "node_modules",
      "@magical-types",
      "generated",
      path.basename(filename) + ".json"
    );
    let genFilename = path.join(path.dirname(filename), relative);
    fs.ensureFileSync(genFilename);
    fs.writeJsonSync(genFilename, nodes);
    babelProgram.node.body.unshift(
      BabelTypes.importDeclaration(
        [BabelTypes.importDefaultSpecifier(id)],
        BabelTypes.stringLiteral(`./${relative}`)
      )
    );
  } else {
    babelProgram.node.body.unshift(
      BabelTypes.variableDeclaration("var", [
        BabelTypes.variableDeclarator(
          id,
          BabelTypes.callExpression(
            BabelTypes.memberExpression(
              BabelTypes.identifier("JSON"),
              BabelTypes.identifier("parse")
            ),
            [BabelTypes.stringLiteral(JSON.stringify(nodes))]
          )
        )
      ])
    );
  }
  callbacks.forEach((cb, i) => {
    cb(id.name, nodesToIndex.get(rootNodes[i])!);
  });
}
