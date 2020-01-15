import { Types, PropTypes as PrettyPropTypes } from "@magical-types/pretty";
import * as React from "react";
import { MagicalNode } from "@magical-types/types";
import { parseStringified } from "./parse";

let parseMagicalNodeFromProps = (props: any): MagicalNode => {
  return parseStringified((props as any).__types)(props.__typeIndex);
};

export let FunctionTypes = (props: {
  function: (...args: Array<any>) => any;
}) => {
  return <Types node={parseMagicalNodeFromProps(props)} />;
};

export function RawTypes<Type>(props: {}) {
  return <Types node={parseMagicalNodeFromProps(props)} />;
}

export let PropTypes = (props: {
  component: React.ComponentType<any>;
  heading?: string;
}) => {
  let node = parseMagicalNodeFromProps(props);
  return <PrettyPropTypes node={node} heading={props.heading} />;
};

export function getNode<Type>() {
  return parseStringified(arguments[0])(arguments[1]);
}
