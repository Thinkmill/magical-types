import { ComponentType } from "react";
import { MagicalNode } from "@magical-types/types";

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
