import { loader as LoaderType } from "webpack";
import * as typescript from "typescript";
import flatted from "flatted";
import { Project } from "ts-morph";
import { convertType } from "@magical-types/convert-type";

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
  let isFreshProject = false;
  if (!projectCache.has(configFileName)) {
    isFreshProject = true;
    const cachedProject = new Project({
      tsConfigFilePath: configFileName,
      addFilesFromTsConfig: false,
      compilerOptions: {
        noEmit: false
      }
    });
    projectCache.set(configFileName, cachedProject);
  }
  let project = projectCache.get(configFileName)!;
  let sourceFile = project.addExistingSourceFile(filename);
  project.resolveSourceFileDependencies();
  let sourceFiles = project.getSourceFiles();
  for (let sourceFile of sourceFiles) {
    if (!isFreshProject) {
      sourceFile.refreshFromFileSystemSync();
    }
    this.addDependency(sourceFile.getFilePath());
  }
  let exportDeclarations = sourceFile.getExportedDeclarations();
  let code = `import * as __flatted from '@magical-types/loader/flatted'\n`;
  for (let [exportName, declaration] of exportDeclarations) {
    let type = declaration[0].getType();
    code += `export var ${exportName} = __flatted.parse(${flatted.stringify(
      convertType((type as any) as typescript.Type, [])
    )})\n`;
  }

  return code;
};
