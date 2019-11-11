import { Types, PropTypes as PrettyPropTypes } from "@magical-types/pretty";
import * as React from "react";
import { MagicalNode } from "@magical-types/types";
import flatted from "flatted";

let getMagicalNode = (props: any): MagicalNode => {
  return flatted.parse((props as any).__types);
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
