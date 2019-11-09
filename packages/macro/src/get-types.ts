import typescript from "typescript";
import { NodePath } from "@babel/core";
import * as BabelTypes from "@babel/types";
import { InternalError } from "@magical-types/errors";
import { Project } from "ts-morph";
import * as flatted from "flatted";
import { convertType } from "@magical-types/convert-type";

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
          let converted = convertType(type, []);
          debugger;
          path.node.attributes.push(
            BabelTypes.jsxAttribute(
              BabelTypes.jsxIdentifier("__types"),
              BabelTypes.jsxExpressionContainer(
                BabelTypes.stringLiteral(flatted.stringify(converted))
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
