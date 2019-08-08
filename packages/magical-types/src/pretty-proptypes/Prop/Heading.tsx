/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { colors, gridSize, borderRadius } from "../components/constants";
import { MagicalNode, ObjectNode } from "../../types";

const Heading = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    css={css`
      border-bottom: 2px solid ${colors.N20};
      font-size: 0.9rem;
      font-weight: normal;
      line-height: 1.4;
      margin: 0 0 ${gridSize}px 0;
      padding-bottom: ${gridSize}px;
    `}
    {...props}
  />
);

const HeadingDefault = (props: React.HTMLAttributes<HTMLElement>) => (
  <code
    css={css`
      color: ${colors.subtleText};
    `}
    {...props}
  />
);

const HeadingRequired = (props: React.HTMLAttributes<HTMLElement>) => (
  <code
    css={css`
      color: ${colors.R500};
    `}
    {...props}
  />
);

const HeadingType = (props: React.HTMLAttributes<HTMLElement>) => (
  <code
    css={css`
      background: ${colors.N20};
      border-radius: ${borderRadius}px;
      color: ${colors.N300};
      display: inline-block;
      padding: 0 0.2em;
    `}
    {...props}
  />
);

const HeadingName = (props: React.HTMLAttributes<HTMLElement>) => (
  <code
    css={css`
      background: ${colors.B50};
      color: ${colors.B500};
      border-radius: ${borderRadius}px;
      display: inline-block;
      margin-right: 0.8em;
      padding: 0 0.2em;
    `}
    {...props}
  />
);

const Whitespace = () => (" " as any) as React.ReactElement;

type PropTypeHeadingProps = {
  name: any;
  required: boolean;
};

const PropTypeHeading = (props: PropTypeHeadingProps) => (
  <Heading>
    <HeadingName>{props.name}</HeadingName>
    <Whitespace />
    {props.required ? <HeadingRequired> required</HeadingRequired> : null}
  </Heading>
);

export default PropTypeHeading;
