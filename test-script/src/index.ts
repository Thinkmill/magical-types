import { Project } from "ts-morph";
import { convertType } from "@magical-types/convert-type";
import fs from "fs";
import path from "path";
import { serializeNodes } from "@magical-types/serialization/serialize";

let project = new Project({
  tsConfigFilePath: path.join(__dirname, "..", "..", "tsconfig.json"),
});

let result = project
  .getSourceFiles("test-script/src/test-thing.tsx")
  .map((file) => {
    return Object.fromEntries(
      [...file.getExportedDeclarations().entries()].map(([name, decl]) => {
        let type = decl[0].getType().compilerType;
        return [name, serializeNodes([convertType(type, [])])] as const;
      })
    );
  });

fs.writeFileSync(
  path.join(__dirname, "index.json"),
  JSON.stringify(result, null, 2)
);
