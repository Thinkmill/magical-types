import jestInCase from "jest-in-case";
import * as babel from "@babel/core";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

const separator = "\n\n      ↓ ↓ ↓ ↓ ↓ ↓\n\n";

const tester = async (opts: { filename: string }) => {
  let rawCode = await readFile(opts.filename, "utf-8");

  const { code } = babel.transformSync(rawCode, {
    plugins: [
      "babel-plugin-macros",
      "@babel/plugin-syntax-jsx",
      "@babel/plugin-syntax-object-rest-spread"
    ],
    presets: ["@babel/preset-typescript"],
    babelrc: false,
    configFile: false,
    filename: opts.filename
  })!;

  expect(`${rawCode}${separator}${code}`).toMatchSnapshot();
};

function doThing(dirname: string) {
  const fixturesFolder = path.join(dirname, "__fixtures__");
  return fs
    .readdirSync(fixturesFolder)
    .map(base => path.join(fixturesFolder, base));
}

type Cases = {
  [key: string]: { only: boolean; skip: boolean; filename: string };
};

export default (name: string, dirname: string) => {
  let cases = doThing(dirname).reduce(
    (accum, filename) => {
      let skip = false;
      let only = false;
      let testTitle = filename;
      if (filename.indexOf(".skip.js") !== -1) {
        skip = true;
      } else if (filename.indexOf(".only.js") !== -1) {
        only = true;
      }
      accum[path.parse(testTitle).name] = {
        filename,
        only,
        skip
      };
      return accum;
    },
    {} as Cases
  );

  return jestInCase<{ code: string; filename: string }>(
    name,
    tester,
    // @ts-ignore
    cases
  );
};
