import React from "react";
/** @jsx jsx */
import { jsx, CSSObject } from "@emotion/core";
import { PropTypes } from "@magical-types/macro/write-data-to-fs.macro";
import Select from "react-select";

type Something = "a" | "b";

type Thing = {
  [Key in Something]: boolean;
};

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      <PropTypes component={Select} />
      {/* <FunctionTypes function={myFunc} /> */}
      {/* <RawTypes<Thing> /> */}
    </div>
  );
};
