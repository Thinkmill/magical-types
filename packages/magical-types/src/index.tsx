import React, { useEffect, useReducer, useMemo, useContext } from "react";
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
  bracketStyle,
  PathExpansionContext
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
  path
}: {
  node: ObjectNode | ClassNode;
  path: Array<number | string>;
}) {
  return (
    <Indent>
      {node.properties.map((prop, index) => {
        return (
          <div key={index}>
            {prop.description !== "" && (
              <div>
                {prop.description}
                <br />
              </div>
            )}
            <TypeMinWidth>
              <Type>{prop.key}</Type>
            </TypeMinWidth>

            {/* {type.optional ? null : (
          <components.Required> required</components.Required>
        )}{" "} */}
            {renderNode(prop.value, path.concat("properties", index, "value"))}
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

function renderNode(
  node: MagicalNode,
  path: Array<string | number>
): React.ReactNode {
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
                  {renderNode(param, path.concat("typeParameters", index))}
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
                  {renderNode(param.type, path.concat("parameters", index))}
                  {array.length - 1 === index ? "" : ", "}
                </React.Fragment>
              ))
            }
          </AddBrackets>
          <Arrow />
          {renderNode(node.return, path.concat("return"))}
        </span>
      );
    }
    case "ReadonlyArray":
    case "Promise":
    case "Array": {
      let newPath = path.concat("value");

      return (
        <span>
          <TypeMeta>{node.type}</TypeMeta>
          <AddBrackets
            initialIsShown={newPath}
            openBracket="<"
            closeBracket=">"
            closedContent={
              (node as any).value.name ? (node as any).value.name : undefined
            }
          >
            {() => <Indent>{renderNode(node.value, newPath)}</Indent>}
          </AddBrackets>
        </span>
      );
    }
    case "Tuple": {
      return (
        <span>
          <TypeMeta>Tuple</TypeMeta>
          <AddBrackets initialIsShown={path} openBracket="[" closeBracket="]">
            {() =>
              node.value.map((node, index, array) => (
                <React.Fragment key={index}>
                  {renderNode(node, path.concat("value", index))}
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
      console.log(path.join(":"));
      return (
        <span>
          <TypeMeta>
            {node.name === null ? "" : `${node.name} `}One of{" "}
          </TypeMeta>
          <AddBrackets initialIsShown={path} openBracket="<" closeBracket=">">
            {() => (
              <Indent>
                {node.types.map((n, index, array) => (
                  <div key={index}>
                    {renderNode(n, path.concat("types", index))}
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
        arr.push(
          <span key={index}>
            {renderNode(type, path.concat("types", index))}
          </span>
        );
        if (index < node.types.length - 1) {
          arr.push(<div key={`divider-${index}`}>&</div>);
        }
      });
      return arr;
    }
    case "Object": {
      return (
        <span>
          <TypeMeta>{node.name}</TypeMeta>
          <AddBrackets initialIsShown={path} openBracket="{" closeBracket="}">
            {() => <Properties path={path} node={node} />}
          </AddBrackets>
        </span>
      );
    }
    case "Class": {
      return (
        <span>
          <TypeMeta>class {node.name}</TypeMeta>

          <AddBrackets initialIsShown={path} openBracket="{" closeBracket="}">
            {() => {
              return <Properties path={path} node={node} />;
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

// what are we doing here?
// first, what do we want to achieve?
// important note to understand this: magical nodes can contain circular references
// 1. we only want to expand each node by default a single time
// 2. the shallowest node and then first node at that depth is the one that should be expanded
// so, how do we implement this?
// we need to do a breadth first graph traversal
// Wikipedia explains what this is: https://en.wikipedia.org/wiki/Breadth-first_search

type PositionedNode = { path: Array<string | number>; node: MagicalNode };
function getPathsThatShouldBeExpandedByDefault(rootNode: MagicalNode) {
  let pathsThatShouldBeExpandedByDefault = new Set<string>();

  // because of circular references, we don't want to visit a node more than once
  let visitedNodes = new Set<MagicalNode>();

  let queue: Array<PositionedNode> = [{ node: rootNode, path: [] }];

  while (queue.length) {
    let currentPositionedNode = queue.shift()!;

    visitedNodes.add(currentPositionedNode.node);
    if (
      ([
        "Object",
        "Union",
        "Array",
        "ReadonlyArray",
        "Tuple",
        "Class",
        "Promise",
        "Builtin"
      ] as Array<MagicalNode["type"]>).includes(currentPositionedNode.node.type)
    ) {
      pathsThatShouldBeExpandedByDefault.add(
        currentPositionedNode.path.join(":")
      );
    }
    // we don't want to open any nodes deeper than 5 nodes by default
    if (currentPositionedNode.path.length < 5) {
      queue.push(
        ...getChildren(currentPositionedNode).filter(
          ({ node }) => !visitedNodes.has(node)
        )
      );
    }
  }
  return pathsThatShouldBeExpandedByDefault;
}

function getChildren({ node, path }: PositionedNode): Array<PositionedNode> {
  switch (node.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "TypeParameter":
    case "Intrinsic": {
      return [];
    }
    case "Union":
    case "Intersection": {
      return node.types.map((node, index) => {
        return { node, path: path.concat("types", index) };
      });
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return [{ node: node.value, path: path.concat("value") }];
    }
    case "Tuple": {
      return node.value.map((node, index) => {
        return { node, path: path.concat("value", index) };
      });
    }
    case "Function": {
      return [
        { node, path: path.concat("return") },
        ...node.parameters.map((param, index) => {
          return {
            node: param.type,
            path: path.concat("parameters", index, "type")
          };
        }),
        ...node.typeParameters.map((node, index) => {
          return { node, path: path.concat("typeParameters", index) };
        })
      ];
    }
    case "Class":
    case "Object": {
      return node.properties.map((param, index) => {
        return {
          node: param.value,
          path: path.concat("properties", index, "value")
        };
      });
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new Error("this should never happen: " + node.type);
    }
  }
}

let renderTypes = (props: any) => {
  let node: MagicalNode = flatted.parse((props as any).__types);
  let pathsThatShouldBeExpandedByDefault = useMemo(() => {
    return getPathsThatShouldBeExpandedByDefault(node);
  }, [node]);
  console.log(pathsThatShouldBeExpandedByDefault, node);

  return (
    <div css={{ fontFamily: "sans-serif" }}>
      <PathExpansionContext.Provider value={pathsThatShouldBeExpandedByDefault}>
        {renderNode(node, [])}
      </PathExpansionContext.Provider>
    </div>
  );
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
