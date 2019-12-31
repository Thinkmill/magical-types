// @ts-ignore
import { createMacro } from "babel-plugin-macros";
import * as BabelTypes from "@babel/types";
import { NodePath } from "@babel/traverse";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";
import { getTypes } from "./get-types";
import { InternalError } from "@magical-types/errors";

type MacroArgs = {
  references: Record<string, NodePath[]>;
  state: { filename: string };
  babel: { types: typeof BabelTypes };
};

let comps = ["PropTypes", "FunctionTypes", "RawTypes"] as const;

export let makeMacro = (writeToFs: boolean) =>
  createMacro(({ references, state, babel }: MacroArgs) => {
    try {
      let t = babel.types;
      let things: Map<
        number,
        Map<
          number,
          | {
              exportName: typeof comps[number];
              path: NodePath<BabelTypes.JSXOpeningElement>;
            }
          | { exportName: "getNode"; path: NodePath<BabelTypes.CallExpression> }
        >
      > = new Map();
      let num = 0;

      let programPath: NodePath<BabelTypes.Program>;

      for (let exportName of [
        "PropTypes",
        "FunctionTypes",
        "RawTypes",
        "getNode"
      ] as const) {
        if (references[exportName] && references[exportName].length) {
          let identifierName: string = addNamed(
            references[exportName][0],
            exportName,
            "@magical-types/macro/runtime"
          ).name;

          references[exportName].forEach(reference => {
            if (!programPath) {
              // @ts-ignore
              programPath = reference.findParent(x => x.isProgram());
            }
            let { parentPath } = reference;

            if (
              parentPath.isJSXOpeningElement() ||
              (parentPath.isCallExpression() &&
                parentPath.node.callee === reference.node)
            ) {
              if (
                reference.node.start === null ||
                reference.node.end === null
              ) {
                throw new Error("start and end not found");
              }
              if (!things.has(reference.node.start)) {
                things.set(reference.node.start, new Map());
              }
              let map = things.get(reference.node.start);
              if (!map) {
                throw new InternalError("this should never happen");
              }
              num++;
              if (parentPath.isCallExpression() && exportName === "getNode") {
                map.set(reference.node.end, { exportName, path: parentPath });
              } else if (
                parentPath.isJSXOpeningElement() &&
                (exportName === "PropTypes" ||
                  exportName === "RawTypes" ||
                  exportName === "FunctionTypes")
              ) {
                map.set(reference.node.end, { exportName, path: parentPath });
              } else {
                throw new InternalError("macro used in wrong spot");
              }
            }
            if (reference.isJSXIdentifier()) {
              reference.replaceWith(t.jsxIdentifier(identifierName));
            } else if (reference.isIdentifier()) {
              reference.replaceWith(t.identifier(identifierName));
            } else {
              throw new Error("reference is not an identifier");
            }
          });
        }
      }
      if (things.size) {
        getTypes(
          state.filename,
          things,
          num,
          // @ts-ignore
          programPath,
          writeToFs
        );
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
