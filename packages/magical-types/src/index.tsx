import React, {
  useState,
  useContext,
  useRef,
  useCallback,
  useEffect,
  useReducer
} from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { ComponentType } from "react";
import { MagicalNode, ObjectNode, ClassNode, TypeParameterNode } from "./types";
import {
  Type,
  Indent,
  StringType,
  TypeMeta
} from "./pretty-proptypes/components";
import { colors } from "./pretty-proptypes/components/constants";
import AddBrackets, {
  bracketStyle
} from "./pretty-proptypes/PrettyConvert/AddBrackets";
import * as flatted from "flatted";

const Arrow = () => (
  <span
    css={css`
      color: ${colors.G500};
    `}
  >
    {" => "}
  </span>
);

const TypeMinWidth = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    css={css`
      display: inline-block;
      min-width: 60px;
    `}
    {...props}
  />
);

function Properties({
  node,
  depth
}: {
  node: ObjectNode | ClassNode;
  depth: number;
}) {
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

let cache = new Map<
  TypeParameterNode,
  { listeners: Array<(...args: any) => any>; value: boolean }
>();

console.log(cache);

// yes, i know this is bad

function PrettyTypeParameter({ node }: { node: TypeParameterNode }) {
  let [, forceUpdate] = useReducer(() => ({}), {});
  let val = cache.get(node);
  if (!val) {
    val = { listeners: [], value: false };
    cache.set(node, val);
  }

  let workingValue = val;

  useEffect(() => {
    workingValue.listeners.push(forceUpdate);
    return () => {
      workingValue.listeners = workingValue.listeners.filter(
        x => x !== forceUpdate
      );
    };
  }, []);

  return (
    <span
      css={bracketStyle({ isHovered: val.value })}
      onMouseEnter={() => {
        workingValue.value = true;
        workingValue.listeners.forEach(listener => {
          listener();
        });
      }}
      onMouseLeave={() => {
        workingValue.value = false;
        workingValue.listeners.forEach(listener => {
          listener();
        });
      }}
    >
      {node.value}
    </span>
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
          {node.typeParameters.length !== 0 && (
            <span>
              <span css={bracketStyle({ isHovered: false })}>{"<"}</span>
              {node.typeParameters.map((param, index, array) => (
                <React.Fragment key={index}>
                  {renderNode(param, depth + 1)}
                  {array.length - 1 === index ? "" : ", "}
                </React.Fragment>
              ))}
              <span css={bracketStyle({ isHovered: false })}>{">"}</span>
            </span>
          )}
          <AddBrackets initialIsShown>
            {() =>
              node.parameters.map((param, index, array) => (
                <React.Fragment key={index}>
                  {param.name ? (
                    <Type>
                      {param.name}
                      {param.required ? "" : "?"}:{" "}
                    </Type>
                  ) : (
                    undefined
                  )}
                  {renderNode(param.type, depth + 1)}
                  {array.length - 1 === index ? "" : ", "}
                </React.Fragment>
              ))
            }
          </AddBrackets>
          <Arrow />
          {renderNode(node.return, depth + 1)}
        </span>
      );
    }
    case "ReadonlyArray":
    case "Array": {
      return (
        <span>
          <TypeMeta>{node.type}</TypeMeta>
          <AddBrackets
            initialIsShown={depth < 5}
            openBracket="<"
            closeBracket=">"
          >
            {() => <Indent>{renderNode(node.value, depth + 1)}</Indent>}
          </AddBrackets>
        </span>
      );
    }
    case "Tuple": {
      return (
        <span>
          <TypeMeta>Tuple</TypeMeta>
          <AddBrackets
            initialIsShown={depth < 5}
            openBracket="["
            closeBracket="]"
          >
            {() =>
              node.value.map((node, index, array) => (
                <React.Fragment key={index}>
                  {renderNode(node, depth + 1)}
                  {array.length - 1 === index ? "" : ", "}
                </React.Fragment>
              ))
            }
          </AddBrackets>
        </span>
      );
    }
    case "TypeParameter": {
      return <PrettyTypeParameter node={node} />;
    }
    case "Union": {
      return (
        <span>
          <TypeMeta>
            {node.name === null ? "" : `${node.name} `}One of{" "}
          </TypeMeta>
          <AddBrackets
            initialIsShown={depth < 5}
            openBracket="<"
            closeBracket=">"
          >
            {() => (
              <Indent>
                {node.types.map((n, index, array) => (
                  <div key={index}>
                    {renderNode(n, depth + 1)}
                    {array.length - 1 === index ? "" : ", "}
                  </div>
                ))}
              </Indent>
            )}
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
      return (
        <span>
          <TypeMeta>{node.name}</TypeMeta>
          <AddBrackets
            initialIsShown={depth < 5}
            openBracket="{"
            closeBracket="}"
          >
            {() => <Properties depth={depth} node={node} />}
          </AddBrackets>
        </span>
      );
    }
    case "Class": {
      return (
        <span>
          <TypeMeta>class {node.name}</TypeMeta>

          <AddBrackets openBracket="{" closeBracket="}">
            {() => {
              return <Properties depth={depth} node={node} />;
            }}
          </AddBrackets>
        </span>
      );
    }
    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
    }
  }
}

let renderTypes = (props: any) => {
  let node: MagicalNode = flatted.parse((props as any).__types);
  return <div css={{ fontFamily: "sans-serif" }}>{renderNode(node, 0)}</div>;
};

export let PropTypes = (props: { component: ComponentType<any> }) => {
  return renderTypes(props);
};

export let FunctionTypes = (props: {
  function: (...args: Array<any>) => any;
}) => {
  return renderTypes(props);
};

export function RawTypes<Type>(props: {}) {
  return renderTypes(props);
}
