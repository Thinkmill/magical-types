// @ts-ignore
import { createMacro, MacroError } from "babel-plugin-macros";
import * as BabelTypes from "@babel/types";
import { Visitor, NodePath } from "@babel/traverse";
import { ComponentType } from "react";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";
import { getTypes } from "./get-types";

export let PropTypes = (props: {
  component: ComponentType<any>;
  graph?: boolean;
}) => {
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
        {
          exportName: typeof comps[number];
          path: NodePath<BabelTypes.JSXOpeningElement>;
        }
      >
    > = new Map();
    let num = 0;

    for (let exportName of comps) {
      if (references[exportName] && references[exportName].length) {
        let identifierName: string = addNamed(
          references[exportName][0],
          exportName,
          "magical-types"
        ).name;

        references[exportName].forEach(reference => {
          let { parentPath } = reference;

          if (parentPath.isJSXOpeningElement()) {
            if (reference.node.start === null || reference.node.end === null) {
              throw new Error("start and end not found");
            }
            if (!things.has(reference.node.start)) {
              things.set(reference.node.start, new Map());
            }
            let map = things.get(reference.node.start);
            if (!map) {
              throw new Error("this should never happen");
            }
            num++;
            map.set(reference.node.end, { exportName, path: parentPath });
          }
          reference.replaceWith(t.jsxIdentifier(identifierName));
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
