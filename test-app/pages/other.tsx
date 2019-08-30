import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { RawTypes } from "magical-types/macro";
import { HashedMagicalNode } from "magical-types/src/types";

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      {/* <RawTypes<HashedMagicalNode> /> */}
    </div>
  );
};
