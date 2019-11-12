// @ts-ignore
import { createMacro } from "babel-plugin-macros";
import * as BabelTypes from "@babel/types";
import { NodePath } from "@babel/traverse";
import { ComponentType } from "react";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";
import { getTypes } from "./get-types";
import { MagicalNode } from "@magical-types/types";
import { InternalError } from "@magical-types/errors";

export let PropTypes = (props: { component: ComponentType<any> }) => {
  return null;
};

export let FunctionTypes = (props: {
  function: (...args: Array<any>) => any;
}) => {
  return null;
};

export let RawTypes = <Type>(props: {}) => {
  return null;
};

export let getNode = <Type>(): MagicalNode => {
  return null as any;
};

type MacroArgs = {
  references: Record<string, NodePath[]>;
  state: { filename: string };
  babel: { types: typeof BabelTypes };
};

let comps = ["PropTypes", "FunctionTypes", "RawTypes"] as const;

export default createMacro(({ references, state, babel }: MacroArgs) => {
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
          let { parentPath } = reference;

          if (
            parentPath.isJSXOpeningElement() ||
            (parentPath.isCallExpression() &&
              parentPath.node.callee === reference.node)
          ) {
            if (reference.node.start === null || reference.node.end === null) {
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
      getTypes(state.filename, things, num);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
});
