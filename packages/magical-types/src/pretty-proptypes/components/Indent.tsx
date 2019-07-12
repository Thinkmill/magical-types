// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";

export default function Indent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      css={css`
        padding-left: 1.3em;
      `}
      {...props}
    />
  );
}
