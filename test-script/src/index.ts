import * as ts from "typescript";

const configPath = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json");

if (!configPath) {
  throw new Error("no config found");
}

const tsconfig = ts.getParsedCommandLineOfConfigFile(
  configPath,
  {},
  {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: e => console.error(e)
  }
);

if (!tsconfig) {
  throw new Error("could not read config");
}

let host = ts.createIncrementalCompilerHost(tsconfig.options, ts.sys);

let program = ts.createIncrementalProgram({
  rootNames: tsconfig.fileNames,
  options: tsconfig.options,
  host
});

let x = program.getSourceFiles();

program.emit();
// console.log(host.getSourceFile(path.join(__dirname, "a.ts")));

console.log(1);
