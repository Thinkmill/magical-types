// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { ReactNode } from "react";
import { colors } from "./constants";

const Required = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    css={css`
      color: ${colors.R500};
    `}
    {...props}
  />
);

export default Required;
