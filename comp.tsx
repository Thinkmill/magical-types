import React from "react";
/** @jsx jsx */
import { jsx, CSSObject } from "@emotion/core";
import { PropTypes, RawTypes } from "magical-types/macro";
import Select from "react-select";

type Something = "a" | "b";

type Thing = {
  [Key in Something]: boolean;
};

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      {/* <PropTypes component={Select} /> */}
      {/* <FunctionTypes function={myFunc} /> */}
      <RawTypes<CSSObject> />
    </div>
  );
};
