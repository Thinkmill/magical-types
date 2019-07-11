import React from "react";
import { ComponentType } from "react";

export let PropTypes = (props: { component: ComponentType<any> }) => {
  console.log(props);
  return <pre>{JSON.stringify((props as any).__types, null, 2)}</pre>;
};
