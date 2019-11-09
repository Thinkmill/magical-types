// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";

const ReadmeDescription = (props: React.HTMLAttributes<HTMLSpanElement>) =>
  typeof props.children === "string" ? (
    <p {...props} />
  ) : (
    <div
      css={css`
        margin-top: 12px;
      `}
      {...props}
    />
  );

export default ReadmeDescription;
