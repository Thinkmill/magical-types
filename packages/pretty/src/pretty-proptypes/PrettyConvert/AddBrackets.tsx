// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { Component, Fragment, useContext, useState } from "react";
import { colors } from "../components/constants";
import { MagicalNode, PositionedMagicalNode } from "@magical-types/types";
import {
  weakMemoize,
  getChildPositionedMagicalNodes
} from "@magical-types/utils";

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

// let nodeShouldDisplayImmediately = weakMemoize(function nodeHasCycles(
//   rootNode: MagicalNode
// ) {
//   let pathsThatShouldBeExpandedByDefault = new Set<string>();

//   // because of circular references, we don't want to visit a node more than once
//   let visitedNodes = new Set<MagicalNode>();

//   let queue: Array<PositionedMagicalNode> = [
//     { node: rootNode, path: [], depth: 0 }
//   ];

//   while (queue.length) {
//     let currentPositionedNode = queue.shift()!;
//     if (currentPositionedNode.depth > 5) {
//       return false;
//     }

//     visitedNodes.add(currentPositionedNode.node);
//     if (
//       ([
//         "Object",
//         "Array",
//         "Tuple",
//         "Class",
//         "Promise",
//         "Union",
//         "TypeParameter",
//         "Intrinsic"
//       ] as Array<MagicalNode["type"]>).includes(currentPositionedNode.node.type)
//     ) {
//     } else {
//       let childPositionedNodes = getChildPositionedMagicalNodes(
//         currentPositionedNode,
//         { ignoreUnloadedLazyNodes: true }
//       );
//       if (childPositionedNodes.some(x => visitedNodes.has(x.node))) {
//         return false;
//       }
//       queue.push(...childPositionedNodes);
//     }
//     // we don't want to open any nodes deeper than 5 nodes by default
//     if (currentPositionedNode.depth < 3) {
//     }
//   }
//   return true;
// });

export default function AddBrackets({
  openBracket = "(",
  closeBracket = ")",
  closedContent = "...",
  initialIsShown,
  children,
  nodes
}: Props) {
  let defaultPathExpansions = useContext(PathExpansionContext);

  let calculatedInitialIsShown =
    typeof initialIsShown === "boolean"
      ? initialIsShown
      : (initialIsShown !== undefined &&
          defaultPathExpansions.has(initialIsShown.join(":"))) ||
        (nodes !== null &&
          nodes.every(
            x =>
              x.type === "Intrinsic" ||
              x.type === "StringLiteral" ||
              x.type === "NumberLiteral" ||
              x.type === "Array" ||
              x.type === "ReadonlyArray"
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
