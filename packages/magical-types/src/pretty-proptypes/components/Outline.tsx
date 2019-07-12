// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { colors } from "./constants";

const Outline = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    css={css`
      color: ${colors.subtleText};
      line-height: 1;
    `}
    {...props}
  />
);

export default Outline;
