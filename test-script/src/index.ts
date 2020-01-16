import { Project } from "ts-morph";
import { convertType } from "@magical-types/convert-type";
import path from "path";

let project = new Project({
  tsConfigFilePath: path.join(__dirname, "..", "..", "tsconfig.json")
});

project.getSourceFiles("test-script/src/*.ts").forEach(file => {
  file.getExportedDeclarations().forEach(([decl], name) => {
    console.log(convertType(decl.getType().compilerType, [name]));
  });
});

setTimeout(() => {}, 10000000);
