import typescript from "typescript";
import * as fs from "fs";
import path from "path";

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

              let propsType =
                getFunctionComponentProps(type) || getClassComponentProps(type);

              if (propsType) {
                console.log(propsType);
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

// console.log(program, typeChecker);

console.log("done");

// i want this process to stay alive when i use node --inspect
function a() {
  setTimeout(() => a(), 100000);
}

a();
