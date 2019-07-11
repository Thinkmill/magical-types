import React from "react";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as AnotherComp } from "../../comp";

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

let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};

export default () => {
  return (
    <div>
      something
      <PropTypes component={MyComponentThatDoesStuff} />
      <PropTypes component={AnotherComp} />
    </div>
  );
};
