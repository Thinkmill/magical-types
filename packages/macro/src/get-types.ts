import typescript from "typescript";
import { NodePath } from "@babel/core";
import * as BabelTypes from "@babel/types";
import { InternalError } from "@magical-types/errors";
import { Project } from "ts-morph";
import { convertType, getPropTypesType } from "@magical-types/convert-type";
import {
  MagicalNode,
  MagicalNodeIndex,
  PositionedMagicalNode
} from "@magical-types/types";
import { serializeNodes } from "./serialize";
import * as fs from "fs-extra";
import path from "path";
import { getChildPositionedMagicalNodes } from "@magical-types/utils";

let projectCache = new Map<string, Project>();

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

  let isFreshProject = false;
  if (!projectCache.has(configFileName)) {
    isFreshProject = true;
    const cachedProject = new Project({
      tsConfigFilePath: configFileName,
      addFilesFromTsConfig: false
    });
    projectCache.set(configFileName, cachedProject);
  }
  let project = projectCache.get(configFileName)!;
  project.addExistingSourceFile(filename);
  project.resolveSourceFileDependencies();

  if (!isFreshProject) {
    let sourceFiles = project.getSourceFiles();
    for (let sourceFile of sourceFiles) {
      sourceFile.refreshFromFileSystemSync();
    }
  }

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
  let nodesBelow5 = 0;

  let typeDataBabelNode;
  if (writeToFs) {
    let below5 = [];
    let between5And10 = [];
    let above10 = [];

    for (let [, { depth, index }] of nodesToIndex) {
      if (depth < 5) {
        below5.push(nodes[index]);
      } else if (depth <= 10) {
        between5And10.push(nodes[index]);
      } else {
        above10.push(nodes[index]);
      }
    }
    let dirname = path.dirname(filename);
    let relativeBase = path.join(
      "node_modules",
      "@magical-types",
      "generated",
      path.basename(filename)
    );
    let below5Filename = relativeBase + "1.json";
    fs.ensureFileSync(path.join(dirname, below5Filename));

    fs.writeJsonSync(path.join(dirname, below5Filename), below5);
    let staticImportId = babelProgram.scope.generateUidIdentifier();

    babelProgram.node.body.unshift(
      BabelTypes.importDeclaration(
        [BabelTypes.importDefaultSpecifier(staticImportId)],
        BabelTypes.stringLiteral(`./${below5Filename}`)
      )
    );

    let items: BabelTypes.Expression[] = [staticImportId];
    if (between5And10.length) {
      let between5And10Filename = relativeBase + "2.json";

      fs.writeJsonSync(
        path.join(dirname, between5And10Filename),
        between5And10
      );
      items.push(
        BabelTypes.functionExpression(
          null,
          [],
          BabelTypes.blockStatement([
            BabelTypes.returnStatement(
              BabelTypes.callExpression(
                (BabelTypes as any).import() as BabelTypes.Identifier,
                [BabelTypes.stringLiteral(`./${between5And10Filename}`)]
              )
            )
          ])
        )
      );
      if (above10.length) {
        let restFilename = relativeBase + "3.json";
        fs.writeJsonSync(path.join(dirname, restFilename), above10);
        items.push(
          BabelTypes.functionExpression(
            null,
            [],
            BabelTypes.blockStatement([
              BabelTypes.returnStatement(
                BabelTypes.callExpression(
                  (BabelTypes as any).import() as BabelTypes.Identifier,
                  [BabelTypes.stringLiteral(`./${between5And10Filename}`)]
                )
              )
            ])
          )
        );
      }
    }

    typeDataBabelNode =
      items.length === 1 ? items[0] : BabelTypes.arrayExpression(items);
  } else {
    typeDataBabelNode = BabelTypes.callExpression(
      BabelTypes.memberExpression(
        BabelTypes.identifier("JSON"),
        BabelTypes.identifier("parse")
      ),
      [BabelTypes.stringLiteral(JSON.stringify(nodes))]
    );
  }
  let id = babelProgram.scope.generateUidIdentifier();

  babelProgram.node.body.unshift(
    BabelTypes.variableDeclaration("var", [
      BabelTypes.variableDeclarator(id, typeDataBabelNode)
    ])
  );
  callbacks.forEach((cb, i) => {
    cb(id.name, nodesToIndex.get(rootNodes[i])!.index);
  });
}
