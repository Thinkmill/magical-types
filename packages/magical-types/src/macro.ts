// @ts-ignore
import { createMacro, MacroError } from "babel-plugin-macros";
import * as BabelTypes from "@babel/types";
import { Visitor, NodePath } from "@babel/traverse";
import { ComponentType } from "react";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";
import { getTypes } from "./get-types";

export let PropTypes = (props: { component: ComponentType<any> }) => {
  return null;
};

type MacroArgs = {
  references: Record<string, NodePath[]>;
  state: { filename: string };
  babel: { types: typeof BabelTypes };
};

export default createMacro(({ references, state, babel }: MacroArgs) => {
  try {
    let t = babel.types;
    if (references.PropTypes && references.PropTypes.length) {
      let identifierName: string = addNamed(
        references.PropTypes[0],
        "PropTypes",
        "magical-types"
      ).name;
      let things: Map<
        number,
        Map<number, NodePath<BabelTypes.JSXOpeningElement>>
      > = new Map();
      references.PropTypes.forEach(reference => {
        let { parentPath } = reference;

        reference.replaceWith(t.jsxIdentifier(identifierName));
        if (parentPath.isJSXOpeningElement()) {
          if (parentPath.node.start === null || parentPath.node.end === null) {
            throw new Error("start and end not found");
          }
          if (!things.has(parentPath.node.start)) {
            things.set(parentPath.node.start, new Map());
          }
          let map = things.get(parentPath.node.start);
          if (!map) {
            throw new Error("this should never happen");
          }
          map.set(parentPath.node.end, parentPath);
        }
      });
      let stuff = getTypes(state.filename, things);
      console.log(stuff);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
});
