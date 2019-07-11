import typescript from "typescript";
import * as fs from "fs";
import path from "path";
import { MagicalNode } from "./types";

let configFileName = typescript.findConfigFile(
  __dirname,
  typescript.sys.fileExists
);

if (!configFileName) {
  throw new Error("No tsconfig.json file could be found");
}

let configFileContents = fs.readFileSync(configFileName, "utf8");

const result = typescript.parseConfigFileTextToJson(
  configFileName,
  configFileContents
);

let config = typescript.parseJsonConfigFileContent(
  result,
  typescript.sys,
  process.cwd(),
  undefined,
  configFileName
);

let program = typescript.createProgram({
  options: config.options,
  rootNames: [path.join(process.cwd(), "comp.tsx")]
});

let typeChecker = program.getTypeChecker();

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

function convertType(type: typescript.Type): MagicalNode {
  if (type.flags & typescript.TypeFlags.Any) {
    return {
      type: "Any"
    };
  }
  if (type.flags & typescript.TypeFlags.Undefined) {
    return {
      type: "Undefined"
    };
  }
  if (type.flags & typescript.TypeFlags.Boolean) {
    return {
      type: "Boolean"
    };
  }
  if (type.flags & typescript.TypeFlags.BooleanLiteral) {
    return {
      type: "BooleanLiteral",
      value: (type as any).value
    };
  }
  if (type.flags & typescript.TypeFlags.Number) {
    return {
      type: "Number"
    };
  }
  if (type.flags & typescript.TypeFlags.String) {
    return {
      type: "String"
    };
  }
  if (type.flags & typescript.TypeFlags.Void) {
    return {
      type: "Void"
    };
  }
  if (type.flags & typescript.TypeFlags.VoidLike) {
    return {
      type: "VoidLike"
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
      types: type.types.map(type => convertType(type))
    };
  }
  if (type.isIntersection()) {
    return {
      type: "Intersection",
      types: type.types.map(type => convertType(type))
    };
  }
  let callSignatures = type.getCallSignatures();
  if (callSignatures.length) {
    return {
      type: "Function",
      signatures: callSignatures.map(callSignature => {
        let returnType = callSignature.getReturnType();
        let parameters = callSignature.getParameters().map(parameter => {
          return {
            name: parameter.name,
            type: convertType(
              typeChecker.getTypeOfSymbolAtLocation(
                parameter,
                parameter.valueDeclaration || parameter.declarations[0]
              )
            )
          };
        });

        return {
          return: convertType(returnType),
          parameters
        };
      })
    };
  }
  if (type.flags & typescript.TypeFlags.Object) {
    return {
      type: "Object",
      name: type.aliasSymbol ? type.aliasSymbol.escapedName.toString() : null,
      properties: type.getProperties().map(symbol => ({
        key: symbol.getEscapedName().toString(),
        value: convertType(
          typeChecker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration || symbol.declarations![0]
          )
        )
      }))
    };
  }
  console.log("Type that could not be stringified:", type);
  throw new Error("Could not stringify type");
}

for (let filename of program.getRootFileNames()) {
  let sourceFile = program.getSourceFile(filename);
  if (sourceFile !== undefined) {
    let visit = (node: typescript.Node) => {
      typescript.forEachChild(node, node => {
        console.log(typescript.SyntaxKind[node.kind]);
        if (
          typescript.isJsxOpeningLikeElement(node) &&
          typescript.isIdentifier(node.tagName) &&
          node.tagName.escapedText === "PropTypes"
        ) {
          let componentAttrib = node.attributes.properties.find(
            x =>
              typescript.isJsxAttribute(x) && x.name.escapedText === "component"
          );
          if (
            componentAttrib &&
            typescript.isJsxAttribute(componentAttrib) &&
            componentAttrib.initializer &&
            typescript.isJsxExpression(componentAttrib.initializer) &&
            componentAttrib.initializer.expression
          ) {
            let symbol = typeChecker.getSymbolAtLocation(
              componentAttrib.initializer.expression
            );

            if (symbol) {
              const type = typeChecker.getTypeOfSymbolAtLocation(
                symbol,
                symbol.valueDeclaration || symbol.declarations![0]
              );

              console.log(type);

              let propsSymbol =
                getFunctionComponentProps(type) || getClassComponentProps(type);

              if (propsSymbol) {
                let propsType = typeChecker.getTypeOfSymbolAtLocation(
                  propsSymbol,
                  propsSymbol.valueDeclaration || propsSymbol.declarations![0]
                );
                console.log(propsType);
                console.log(convertType(propsType));
              }
            }
          }
        }

        visit(node);
      });
    };
    visit(sourceFile);
  }
}

// i want this process to stay alive when i use node --inspect
function a() {
  setTimeout(() => a(), 100000);
}

a();
