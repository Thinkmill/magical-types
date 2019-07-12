import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { ComponentType } from "react";
import { MagicalNode, ObjectNode } from "./types";
import {
  Type,
  Indent,
  StringType,
  TypeMeta
} from "./pretty-proptypes/components";
import { colors } from "./pretty-proptypes/components/constants";
import AddBrackets from "./pretty-proptypes/PrettyConvert/AddBrackets";

const Arrow = () => (
  <span
    css={css`
      color: ${colors.G500};
    `}
  >
    {" => "}
  </span>
);

export const TypeMinWidth = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    css={css`
      display: inline-block;
      min-width: 60px;
    `}
    {...props}
  />
);

function Properties({ node, depth }: { node: ObjectNode; depth: number }) {
  return (
    <Indent>
      {node.properties.map((prop, index) => {
        return (
          <div key={index}>
            <TypeMinWidth>
              <Type>{prop.key}</Type>
            </TypeMinWidth>

            {/* {type.optional ? null : (
          <components.Required> required</components.Required>
        )}{" "} */}
            {renderNode(prop.value, depth + 1)}
          </div>
        );
      })}
    </Indent>
  );
}

function renderNode(node: MagicalNode, depth: number): React.ReactNode {
  switch (node.type) {
    case "Intrinsic": {
      return <Type>{node.value}</Type>;
    }
    case "StringLiteral": {
      return <StringType>"{node.value}"</StringType>;
    }
    case "NumberLiteral": {
      return <Type>{node.value}</Type>;
    }
    case "Function": {
      return (
        <span>
          <AddBrackets>
            {node.parameters.map((param, index, array) => (
              <React.Fragment key={index}>
                {param.name ? <Type>{param.name}: </Type> : undefined}
                {renderNode(param.type, depth + 1)}
                {array.length - 1 === index ? "" : ", "}
              </React.Fragment>
            ))}
          </AddBrackets>
          <Arrow />
          {renderNode(node.return, depth + 1)}
        </span>
      );
    }
    case "Union": {
      return (
        <span>
          <TypeMeta>One of </TypeMeta>
          <AddBrackets openBracket="<" closeBracket=">">
            <Indent>
              {node.types.map((n, index, array) => (
                <div key={index}>
                  {renderNode(n, depth + 1)}
                  {array.length - 1 === index ? "" : ", "}
                </div>
              ))}
            </Indent>
          </AddBrackets>
        </span>
      );
    }
    case "Intersection": {
      let arr: Array<React.ReactNode> = [];
      node.types.forEach((type, index) => {
        if (index < node.types.length - 1) {
          arr.push(
            <span key={index}>{renderNode(type, depth + 1)}</span>,
            <div key={`divider-${index}`}>&</div>
          );
        } else {
          arr.push(<span key={index}>{renderNode(type, depth + 1)}</span>);
        }
      });
      return arr;
    }
    case "Object": {
      let props = <Properties depth={depth} node={node} />;
      if (node.name !== null && depth !== 0) {
        return (
          <span>
            <AddBrackets
              initialIsShown={false}
              closedContent={<Type>{node.name}</Type>}
              openBracket="{"
              closeBracket="}"
            >
              {props}
            </AddBrackets>
          </span>
        );
      }
      return (
        <span>
          <AddBrackets
            closedContent={
              node.name === null ? undefined : <Type>{node.name}</Type>
            }
            openBracket="{"
            closeBracket="}"
          >
            {props}
          </AddBrackets>
        </span>
      );
    }
    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
    }
  }
}
export let PropTypes = (props: { component: ComponentType<any> }) => {
  console.log(props);
  let node: MagicalNode = (props as any).__types;
  return (
    <div>
      {renderNode(node, 0)}
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
};
