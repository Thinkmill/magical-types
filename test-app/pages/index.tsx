import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as AnotherComp } from "../../comp";

type Thing = (firstArg: string) => number;

type Obj = { thing: boolean };

type Props = {
  /* Some description for this */
  a?: boolean;
  b: any;
  c?: "some string";
  d: "some string" | "something";
  e: Thing;
  f: Obj;
  g: object;
};

type PropsAlias = Props;

let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      <PropTypes component={MyComponentThatDoesStuff} />
      <PropTypes component={AnotherComp} />
    </div>
  );
};
