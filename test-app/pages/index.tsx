import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as AnotherComp } from "../../comp";

type Thing = (firstArg: string) => number;

type Obj = { thing: boolean };

type Props = {
  c: React.ReactElement;
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
    </div>
  );
};
