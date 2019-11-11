import React from "react";
/** @jsx jsx */
import { jsx, CSSObject } from "@emotion/core";
import { RawTypes } from "@magical-types/macro";

type Something = "a" | "b";

type Thing = {
  [Key in Something]: boolean;
};

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      {/* <PropTypes component={MyComponentThatDoesStuff} /> */}
      {/* <FunctionTypes function={myFunc} /> */}
      <RawTypes<Thing> />
    </div>
  );
};
