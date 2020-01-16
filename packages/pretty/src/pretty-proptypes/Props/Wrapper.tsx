// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { gridSize } from "../components/constants";

const Wrapper = (props: React.HTMLAttributes<HTMLElement>) => (
  <div
    css={css`
      margin-top: ${gridSize * 1.5}px;
      font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New,
        monospace;
      @media (min-width: 780px) {
        margin-bottom: ${gridSize * 3}px;
        margin-top: ${gridSize * 3}px;
      }
    `}
    {...props}
  />
);

const H2 = (props: React.HTMLAttributes<HTMLElement>) => (
  <h2
    css={css`
      margin-top: 1em;
    `}
    {...props}
  />
);

export default Wrapper;
