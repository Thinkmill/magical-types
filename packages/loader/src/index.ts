import { loader as LoaderType } from "webpack";
import * as typescript from "typescript";
import flatted from "flatted";
import { Project, FileSystemRefreshResult } from "ts-morph";
import { convertType, getPropTypesType } from "@magical-types/convert-type";

let projectCache = new Map<string, Project>();

let loader: LoaderType.Loader = function() {
  let filename = this.resourcePath;
  let configFileName = typescript.findConfigFile(
    filename,
    typescript.sys.fileExists
  );
  if (!configFileName) {
    throw new Error("No tsconfig.json file could be found");
  }
  if (!projectCache.has(configFileName)) {
    const cachedProject = new Project({
      tsConfigFilePath: configFileName,
      compilerOptions: {
        noEmit: false
      }
    });
    projectCache.set(configFileName, cachedProject);
  }
  let project = projectCache.get(configFileName)!;
  let sourceFile = project.getSourceFileOrThrow(filename);
  let exportDeclarations = sourceFile.getExportedDeclarations();
  let code = `import * as __flatted from '@magical-types/loader/flatted'\n`;
  for (let [exportName, declaration] of exportDeclarations) {
    let type = declaration[0].getType().compilerType;
    if (exportName[0].toUpperCase() === exportName[0]) {
      type = getPropTypesType(type);
    }
    code += `export var ${exportName} = __flatted.parse(${JSON.stringify(
      flatted.stringify(convertType(type, []))
    )})\n`;
  }

  return `export var thing = true`;
};

export default loader;
