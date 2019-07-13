import typescript from "typescript";
import * as fs from "fs";
import { NodePath, types } from "@babel/core";
import * as BabelTypes from "@babel/types";
import { MagicalNode } from "./types";
import { Project } from "ts-morph";
import * as flatted from "flatted";

export function getTypes(
  filename: string,
  things: Map<number, Map<number, NodePath<BabelTypes.JSXOpeningElement>>>,
  numOfThings: number
) {
  let configFileName = typescript.findConfigFile(
    filename,
    typescript.sys.fileExists
  );
  let nodeCache = new Map<number, MagicalNode>();
  if (!configFileName) {
    throw new Error("No tsconfig.json file could be found");
  }
  const project = new Project({
    tsConfigFilePath: configFileName,
    addFilesFromTsConfig: false
  });
  project.addExistingSourceFile(filename);
  project.resolveSourceFileDependencies();
  function getFunctionComponentProps(type: typescript.Type) {
    const callSignatures = type.getCallSignatures();

    if (callSignatures.length) {
      for (const sig of callSignatures) {
        const params = sig.getParameters();
        if (params.length !== 0) {
          return params[0];
        }
      }
    }
  }

  function getClassComponentProps(type: typescript.Type) {
    const constructSignatures = type.getConstructSignatures();

    if (constructSignatures.length) {
      for (const sig of constructSignatures) {
        const instanceType = sig.getReturnType();
        const props = instanceType.getProperty("props");
        if (props) {
          return props;
        }
      }
    }
  }

  function setToNodeCache(
    getNode: () => MagicalNode,
    typeToSet: typescript.Type
  ) {
    let obj = {};
    // @ts-ignore
    nodeCache.set((typeToSet as any).id, obj);
    let node = getNode();
    Object.assign(obj, node);
    return node;
  }
  function convertType(type: typescript.Type): MagicalNode {
    let id: number = (type as any).id;
    let cachedNode = nodeCache.get(id);
    if (cachedNode !== undefined) {
      return cachedNode;
    }
    if (
      (type as any).intrinsicName &&
      (type as any).intrinsicName !== "error"
    ) {
      return setToNodeCache(
        () => ({
          type: "Intrinsic",
          value: (type as any).intrinsicName
        }),
        type
      );
    }

    if (type.isStringLiteral()) {
      return setToNodeCache(
        () => ({
          type: "StringLiteral",
          value: type.value
        }),
        type
      );
    }
    if (type.isNumberLiteral()) {
      return setToNodeCache(
        () => ({
          type: "NumberLiteral",
          value: type.value
        }),
        type
      );
    }
    if (type.isUnion()) {
      return setToNodeCache(
        () => ({
          type: "Union",
          types: type.types.map(type => convertType(type))
        }),
        type
      );
    }
    if (type.isIntersection()) {
      return setToNodeCache(
        () => ({
          type: "Union",
          types: type.types.map(type => convertType(type))
        }),
        type
      );
    }

    if ((typeChecker as any).isArrayType(type)) {
      return setToNodeCache(
        () => ({
          type: "Array",
          value: convertType((type as any).typeArguments[0])
        }),
        type
      );
    }

    if ((typeChecker as any).isTupleType(type)) {
      return setToNodeCache(
        () => ({
          type: "Tuple",
          value: ((type as any) as {
            typeArguments: Array<typescript.Type>;
          }).typeArguments.map(x => convertType(x))
        }),
        type
      );
    }

    let callSignatures = type.getCallSignatures();

    if (callSignatures.length) {
      return setToNodeCache(() => {
        let signatures = callSignatures.map(callSignature => {
          let returnType = callSignature.getReturnType();
          let parameters = callSignature.getParameters().map(parameter => {
            let type = typeChecker.getTypeOfSymbolAtLocation(
              parameter,
              parameter.valueDeclaration || parameter.declarations[0]
            );
            return {
              name: parameter.name,
              type: convertType(type)
            };
          });

          return {
            type: "Function",
            return: convertType(returnType),
            parameters
          } as const;
        });
        if (signatures.length === 1) {
          return signatures[0];
        }
        return {
          type: "Union",
          types: signatures
        };
      }, type);
    }
    if (type.flags & typescript.TypeFlags.Object) {
      return setToNodeCache(
        () => ({
          type: "Object",
          name: type.aliasSymbol
            ? type.aliasSymbol.escapedName.toString()
            : null,
          properties: type.getProperties().map(symbol => {
            if (!symbol.valueDeclaration || !symbol.declarations[0]) {
              debugger;
            }
            let type = typeChecker.getTypeOfSymbolAtLocation(
              symbol,
              symbol.valueDeclaration || symbol.declarations![0]
            );

            return {
              key: symbol.getEscapedName().toString(),
              value: convertType(type)
            };
          })
        }),
        type
      );
    }
    if (type.isTypeParameter()) {
      return setToNodeCache(
        () => ({
          type: "TypeParameter",
          value: type.symbol.escapedName.toString()
        }),
        type
      );
    }
    debugger;
    console.log("Type that could not be stringified:", type);
    throw new Error("Could not stringify type");
  }

  let sourceFile = project.getSourceFileOrThrow(filename).compilerNode;
  let typeChecker = project.getTypeChecker().compilerObject;

  let num = 0;
  let visit = (node: typescript.Node) => {
    typescript.forEachChild(node, node => {
      let map = things.get(node.pos);

      if (map) {
        let nodePath = map.get(node.end);
        if (nodePath) {
          num++;
          if (!typescript.isJsxOpeningLikeElement(node.parent)) {
            throw new Error("is not a jsx opening element");
          }
          let jsxOpening = node.parent;
          let componentAttrib = jsxOpening.attributes.properties.find(
            x =>
              typescript.isJsxAttribute(x) && x.name.escapedText === "component"
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
            throw new Error("could not find component attrib");
          }
          let symbol = typeChecker.getSymbolAtLocation(
            componentAttrib.initializer.expression
          );

          if (!symbol) {
            throw new Error("could not find symbol");
          }
          const type = typeChecker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration || symbol.declarations![0]
          );

          let propsSymbol =
            getFunctionComponentProps(type) || getClassComponentProps(type);

          if (!propsSymbol) {
            throw new Error("could not find props symbol");
          }

          let propsType = typeChecker.getTypeOfSymbolAtLocation(
            propsSymbol,
            propsSymbol.valueDeclaration || propsSymbol.declarations![0]
          );

          nodePath.node.attributes.push(
            BabelTypes.jsxAttribute(
              BabelTypes.jsxIdentifier("__types"),
              BabelTypes.jsxExpressionContainer(
                BabelTypes.stringLiteral(
                  flatted.stringify(convertType(propsType))
                )
              )
            )
          );
        }
      }

      visit(node);
    });
  };
  visit(sourceFile);
  if (num !== numOfThings) {
    throw new Error("num !== numOfThings");
  }
}
