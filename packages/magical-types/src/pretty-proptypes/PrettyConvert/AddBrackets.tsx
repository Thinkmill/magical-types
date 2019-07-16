// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { Component, Fragment, useContext, useState } from "react";
import { colors } from "../components/constants";

export let bracketStyle = ({ isHovered }: { isHovered: boolean }) => css`
  background-color: ${isHovered ? colors.P300 : colors.N20};
  color: ${isHovered ? "white" : colors.subtleText};
  border: 0;
  font-size: 14px;
  font-family: sans-serif;
  line-height: 20px;
  width: auto;
  margin: 2px 0;
  padding: 0 0.2em;
`;

const StateBit = ({
  isHovered,
  ...props
}: { isHovered: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    css={[
      bracketStyle({ isHovered }),
      css`
        :hover {
          cursor: pointer;
        }
      `
    ]}
    {...props}
  />
);

type Props = {
  openBracket?: string;
  closeBracket?: string;
  children: () => React.ReactNode;
  closedContent?: React.ReactNode;
  initialIsShown?: boolean | Array<string | number>;
};

type State = {
  isHovered: boolean;
  isShown: boolean;
};

export let PathExpansionContext = React.createContext(new Set<string>());

export default function AddBrackets({
  openBracket = "(",
  closeBracket = ")",
  closedContent = "...",
  initialIsShown = false,
  children
}: Props) {
  let [isHovered, setIsHovered] = useState(false);
  let defaultPathExpansions = useContext(PathExpansionContext);
  let [isShown, setIsShown] = useState(
    typeof initialIsShown === "boolean"
      ? initialIsShown
      : defaultPathExpansions.has(initialIsShown.join(":"))
  );

  let props = {
    isHovered,
    onClick: () => {
      setIsShown(!isShown);
      setIsHovered(isShown);
    },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  };

  return (
    <Fragment>
      <StateBit {...props}>{openBracket}</StateBit>
      {isShown ? children() : <StateBit {...props}>{closedContent}</StateBit>}
      <StateBit {...props}>{closeBracket}</StateBit>
    </Fragment>
  );
}
