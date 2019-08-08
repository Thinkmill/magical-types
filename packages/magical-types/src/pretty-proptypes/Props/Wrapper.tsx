// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { gridSize } from "../components/constants";

const Wrapper = (props: React.HTMLAttributes<HTMLElement>) => (
  <div
    css={css`
      margin-top: ${gridSize * 1.5}px;

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

const PropsWrapper = ({
  children,
  heading
}: {
  children: React.ReactNode;
  heading?: string;
}) => (
  <Wrapper>
    {typeof heading === "string" && heading.length === 0 ? null : (
      <H2>{heading || "Props"}</H2>
    )}
    {children}
  </Wrapper>
);

export default PropsWrapper;
