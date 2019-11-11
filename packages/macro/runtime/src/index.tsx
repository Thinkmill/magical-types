import { Types, PropTypes as PrettyPropTypes } from "@magical-types/pretty";
import * as React from "react";
import { MagicalNode } from "@magical-types/types";
import flatted from "flatted";

function parseStringified(val: string): MagicalNode {
  try {
    return flatted.parse(val);
  } catch (err) {
    console.error("error parsing stringified node:", val);
    throw err;
  }
}

let getMagicalNode = (props: any): MagicalNode => {
  return parseStringified((props as any).__types);
};

export let FunctionTypes = (props: {
  function: (...args: Array<any>) => any;
}) => {
  return <Types node={getMagicalNode(props)} />;
};

export function RawTypes<Type>(props: {}) {
  return <Types node={getMagicalNode(props)} />;
}

export let PropTypes = (props: {
  component: React.ComponentType<any>;
  heading?: string;
}) => {
  let node = getMagicalNode(props);
  return <PrettyPropTypes node={node} heading={props.heading} />;
};

export function getNode<Type>() {
  return parseStringified(arguments[0]);
}
