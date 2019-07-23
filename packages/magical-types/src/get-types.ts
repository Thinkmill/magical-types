import typescript from "typescript";
import * as fs from "fs";
import { NodePath, types } from "@babel/core";
import * as BabelTypes from "@babel/types";
import { MagicalNode, Property, TypeParameterNode } from "./types";
import { InternalError } from "./errors";
import { Project } from "ts-morph";
import * as flatted from "flatted";

export function getTypes(
  filename: string,
  things: Map<
    number,
    Map<
      number,
      {
        exportName: "PropTypes" | "FunctionTypes" | "RawTypes";
        path: NodePath<BabelTypes.JSXOpeningElement>;
      }
    >
  >,
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

  function convertProperty(
    symbol: typescript.Symbol,
    path: Array<string | number>
  ): Property {
    let declaration = symbol.valueDeclaration || symbol.declarations[0];

    if (!declaration) {
      debugger;
    }
    let type = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
    // TODO: this could be better
    let key = symbol.getName();
    let thing = typescript.displayPartsToString(
      symbol.getDocumentationComment(typeChecker)
    );
    return {
      description: thing,
      key,
      value: convertType(type, path.concat("getProperties()", key))
    };
  }

  function getNameForType(type: typescript.Type): string | null {
    if (type.symbol) {
      let name = type.symbol.getName();
      if (name !== "__type") {
        return name;
      }
    }
    if (type.aliasSymbol) {
      return type.aliasSymbol.getName();
    }
    return null;
  }
  function convertType(
    type: typescript.Type,
    path: Array<string | number>
  ): MagicalNode {
    let id: number = (type as any).id;
    let cachedNode = nodeCache.get(id);
    if (cachedNode !== undefined) {
      return cachedNode;
    }
    let obj = {} as MagicalNode;
    nodeCache.set(id, obj);
    try {
      let node = _convertType(type, path);
      Object.assign(obj, node);
      return obj;
    } catch (err) {
      err.message = `The following error occurred while trying to stringify the following path: ${path} :${
        err.message
      }`;
      throw err;
    }
  }

  let ptn = /lib\.[a-zA-Z\.]\.d\.ts$/;
  function _convertType(
    type: typescript.Type,
    path: Array<string | number>
  ): MagicalNode {
    if (
      type.symbol &&
      type.symbol.valueDeclaration &&
      ptn.test((type.symbol.valueDeclaration.getSourceFile() as any).path)
    ) {
      return {
        type: "Builtin",
        name: type.symbol.getName(),
        typeArguments: ((type as any).typeArguments || []).map((x, index) =>
          convertType(x, path.concat("typeArguments", index))
        )
      };
    }
    if (
      (type as any).intrinsicName &&
      (type as any).intrinsicName !== "error"
    ) {
      return {
        type: "Intrinsic",
        value: (type as any).intrinsicName
      };
    }

    if (type.symbol && type.symbol.escapedName === "Promise") {
      return {
        type: "Promise",
        value: convertType(
          (type as any).typeArguments[0],
          path.concat("typeArguments", 0)
        )
      };
    }

    if (type.isStringLiteral()) {
      return {
        type: "StringLiteral",
        value: type.value
      };
    }
    if (type.isNumberLiteral()) {
      return {
        type: "NumberLiteral",
        value: type.value
      };
    }
    if (type.isUnion()) {
      return {
        type: "Union",
        name: getNameForType(type),
        types: type.types.map((type, index) =>
          convertType(type, path.concat("types", index))
        )
      };
    }
    if (type.isIntersection()) {
      return {
        type: "Intersection",
        types: type.types.map((type, index) =>
          convertType(type, path.concat("types", index))
        )
      };
    }

    if ((typeChecker as any).isArrayType(type)) {
      // TODO: fix ReadonlyArray
      return {
        type: "Array",
        value: convertType(
          (type as any).typeArguments[0],
          path.concat("typeArguments", 0)
        )
      };
    }

    if ((typeChecker as any).isTupleType(type)) {
      return {
        type: "Tuple",
        value: ((type as any) as {
          typeArguments: Array<typescript.Type>;
        }).typeArguments.map((x, index) =>
          convertType(x, path.concat("typeArguments", index))
        )
      };
    }

    if (type.isClass()) {
      return {
        type: "Class",
        name: type.symbol ? type.symbol.getName() : null,
        typeParameters: (type.typeParameters || []).map((x, index) =>
          convertType(x, path.concat("typeParameters", index))
        ),
        thisNode: type.thisType
          ? convertType(type.thisType, path.concat("thisType"))
          : null,
        properties: type.getProperties().map((symbol, index) => {
          return convertProperty(symbol, path);
        })
      };
    }

    if (type.flags & typescript.TypeFlags.Object) {
      return {
        type: "Object",
        name: getNameForType(type),
        properties: type.getProperties().map((symbol, index) => {
          return convertProperty(symbol, path);
        })
      };
    }
    let callSignatures = type.getCallSignatures();

    if (callSignatures.length) {
      let signatures = callSignatures.map((callSignature, index) => {
        let localPath = path.concat("getCallSignatures()", index);

        let returnType = callSignature.getReturnType();
        let typeParameters = callSignature.getTypeParameters() || [];
        let parameters = callSignature.getParameters().map(parameter => {
          let declaration =
            parameter.valueDeclaration || parameter.declarations[0];

          if (!typescript.isParameter(declaration)) {
            throw new InternalError(
              "expected node to be a parameter declaration but it was not"
            );
          }

          if (
            typeChecker.isOptionalParameter(declaration) &&
            declaration.type
          ) {
            return {
              required: false,
              name: parameter.name,
              type: convertType(
                typeChecker.getTypeFromTypeNode(declaration.type),
                localPath.concat("getParameters()", parameter.name)
              )
            };
          }

          let type = typeChecker.getTypeOfSymbolAtLocation(
            parameter,
            declaration
          );
          return {
            required: true,
            name: parameter.name,
            type: convertType(
              type,
              localPath.concat("getParameters()", parameter.name)
            )
          };
        });

        return {
          name: getNameForType(type),
          type: "Function",
          return: convertType(returnType, localPath.concat("getReturnType()")),
          parameters,
          typeParameters: typeParameters.map(
            (x, index) =>
              convertType(
                x,
                path.concat("typeParameters", index)
              ) as TypeParameterNode
          )
        } as const;
      });
      if (signatures.length === 1) {
        return signatures[0];
      }
      return {
        type: "Union",
        name: getNameForType(type),
        types: signatures
      };
    }

    if (type.isTypeParameter()) {
      return {
        type: "TypeParameter",
        value: type.symbol.getName()
      };
    }
    return { type: "Unknown" };
    debugger;
    console.log("Type that could not be stringified:", type);
    throw new InternalError("Could not stringify type of path: " + path);
  }

  let sourceFile = project.getSourceFileOrThrow(filename).compilerNode;
  let typeChecker = project.getTypeChecker().compilerObject;

  let num = 0;
  let visit = (node: typescript.Node) => {
    typescript.forEachChild(node, node => {
      let map = things.get(node.pos);

      if (map) {
        let val = map.get(node.end);
        if (val) {
          let { exportName, path } = val;
          num++;
          if (!typescript.isJsxOpeningLikeElement(node.parent)) {
            throw new InternalError("is not a jsx opening element");
          }
          let jsxOpening = node.parent;
          let type: typescript.Type;
          if (exportName === "PropTypes" || exportName === "FunctionTypes") {
            let componentAttrib = jsxOpening.attributes.properties.find(
              x =>
                typescript.isJsxAttribute(x) &&
                x.name.escapedText ===
                  (exportName === "PropTypes" ? "component" : "function")
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

            if (exportName === "PropTypes") {
              let propsSymbol =
                getFunctionComponentProps(type) || getClassComponentProps(type);

              if (!propsSymbol) {
                throw new InternalError("could not find props symbol");
              }

              type = typeChecker.getTypeOfSymbolAtLocation(
                propsSymbol,
                propsSymbol.valueDeclaration || propsSymbol.declarations![0]
              );
            }
          } else {
            if (!jsxOpening.typeArguments) {
              throw new InternalError("no type arguments on RawTypes");
            }
            if (!jsxOpening.typeArguments[0]) {
              throw new InternalError("no type argument on RawTypes");
            }
            type = typeChecker.getTypeFromTypeNode(jsxOpening.typeArguments[0]);
          }

          path.node.attributes.push(
            BabelTypes.jsxAttribute(
              BabelTypes.jsxIdentifier("__types"),
              BabelTypes.jsxExpressionContainer(
                BabelTypes.stringLiteral(
                  flatted.stringify(convertType(type, []))
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
    throw new InternalError("num !== numOfThings");
  }
}
