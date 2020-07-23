import React, { HTMLAttributes } from "react";
/** @jsx jsx */
import { jsx, CSSObject } from "@emotion/core";
import { PropTypes } from "@magical-types/macro/write-data-to-fs.macro";
import Select from "react-select";

function Thing(thing: HTMLAttributes<HTMLElement>) {
  return null;
}

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      <PropTypes component={Thing} />
      {/* <FunctionTypes function={myFunc} /> */}
      {/* <RawTypes<Thing> /> */}
    </div>
  );
};
