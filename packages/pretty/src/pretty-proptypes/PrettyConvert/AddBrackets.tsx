// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { Component, Fragment, useContext, useState } from "react";
import { colors } from "../components/constants";
import { MagicalNode } from "@magical-types/types";

export let bracketStyle = ({ isHovered }: { isHovered: boolean }) => css`
  background-color: ${isHovered ? colors.P300 : colors.N20};
  color: ${isHovered ? "white" : colors.subtleText};
  border: 0;
  font-size: 14px;
  line-height: 20px;
  width: auto;
  margin: 2px 0;
  padding: 0 0.2em;
`;

const StateBit = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="state-bit"
    type="button"
    css={[
      bracketStyle({ isHovered: false }),
      css`
        &:hover,
        &:hover ~ .state-bit,
        .state-bit ~ &:hover {
          background-color: ${colors.P300};
          color: white;
        }
      `
    ]}
    {...props}
  />
);

type Props = {
  openBracket?: string;
  closeBracket?: string;
  children: React.ReactNode;
  closedContent?: React.ReactNode;
  initialIsShown?: boolean | Array<string | number>;
  nodes: MagicalNode[] | null;
};

export let PathExpansionContext = React.createContext(new Set<string>());

export default function AddBrackets({
  openBracket = "(",
  closeBracket = ")",
  closedContent = "...",
  initialIsShown = false,
  children,
  nodes
}: Props) {
  let defaultPathExpansions = useContext(PathExpansionContext);

  let calculatedInitialIsShown =
    typeof initialIsShown === "boolean"
      ? initialIsShown
      : defaultPathExpansions.has(initialIsShown.join(":")) ||
        (nodes !== null &&
          nodes.every(
            x =>
              x.type === "Intrinsic" ||
              x.type === "StringLiteral" ||
              x.type === "NumberLiteral"
          ) &&
          nodes.length <= 5);
  let [isShown, setIsShown] = useState(calculatedInitialIsShown);

  let props = {
    onClick: () => {
      setIsShown(!isShown);
    }
  };

  return isShown ? (
    <React.Fragment>
      <StateBit {...props}>{openBracket}</StateBit>
      {children}
      <StateBit {...props}>{closeBracket}</StateBit>
    </React.Fragment>
  ) : (
    <StateBit {...props}>
      {openBracket}
      {closedContent}
      {closeBracket}
    </StateBit>
  );
}
