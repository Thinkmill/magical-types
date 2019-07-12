import { Project } from "ts-morph";
import path from "path";

const project = new Project({
  tsConfigFilePath: path.join(__dirname, "..", "..", "..", "tsconfig.json")
});

let sourceFile = project.getSourceFileOrThrow(
  path.resolve(__dirname, "..", "..", "..", "comp.tsx")
);
