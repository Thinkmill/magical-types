import React from "react";

type Thing = (firstArg: string) => number;

type Props = {
  /* Some description for this */
  a: boolean;
  b: any;
  c: "some string";
  d: "some string" | "something";
  e: Thing;
};

type PropsAlias = Props;

export let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};
