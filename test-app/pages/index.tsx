import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as AnotherComp } from "../../comp";

// type Thing = (firstArg: string) => number;

class Thing {
  constructor(something: boolean) {}
  x: string = "";
  doAThing(something: number): string {
    return "";
  }
}

type Props = {
  children: Thing;
  other: ReadonlyArray<string>;
  oneMore: Array<boolean>;
  another: string[];
  useEffect: typeof React["useEffect"];
  createContext: typeof React["createContext"];
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
