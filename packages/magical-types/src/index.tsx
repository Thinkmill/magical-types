import React, { useEffect, useReducer, useMemo, useContext } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { ComponentType } from "react";
import ReactMarkdown from "react-markdown";
import {
  MagicalNode,
  ObjectNode,
  ClassNode,
  TypeParameterNode,
  SignatureNode,
  PositionedMagicalNode,
  Parameter
} from "./types";
import {
  Type,
  Indent,
  StringType,
  TypeMeta,
  Description
} from "./pretty-proptypes/components";
import { colors, gridSize } from "./pretty-proptypes/components/constants";
import AddBrackets, {
  bracketStyle,
  PathExpansionContext
} from "./pretty-proptypes/PrettyConvert/AddBrackets";
import { getChildPositionedMagicalNodes, flatMap } from "./utils";
import PropTypeHeading from "./pretty-proptypes/Prop/Heading";
import PropsWrapper from "./pretty-proptypes/Props/Wrapper";
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
  node: ClassNode;
  path: Array<number | string>;
}) {
  return (
    <Indent>
      {node.properties.map((prop, index) => {
        return (
          <div key={index}>
            {prop.description !== "" && (
              <div>
                <ReactMarkdown source={prop.description} />
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

function PrettyObject({
  node,
  path
}: {
  node: ObjectNode;
  path: Array<number | string>;
}) {
  return (
    <Indent>
      {node.constructSignatures.map((signature, index) => {
        return (
          <PrettySignatureButDifferent
            key={index}
            node={signature}
            path={path.concat("constructSignatures", index)}
            type="construct"
          />
        );
      })}
      {node.callSignatures.map((signature, index) => {
        return (
          <PrettySignatureButDifferent
            key={index}
            node={signature}
            path={path.concat("callSignatures", index)}
            type="call"
          />
        );
      })}
      {node.properties.map((prop, index) => {
        return (
          <div key={index}>
            {prop.description !== "" && (
              <div>
                <ReactMarkdown source={prop.description} />
              </div>
            )}
            <TypeMinWidth>
              <Type>{prop.key + (prop.required ? "" : "?")}</Type>
            </TypeMinWidth>

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
    <Type
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
    </Type>
  );
}

function Parameters({
  parameters,
  path
}: {
  parameters: Parameter[];
  path: Array<string | number>;
}) {
  return (
    <React.Fragment>
      {parameters.map((param, index, array) => (
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
      ))}
    </React.Fragment>
  );
}

function PrettySignatureButDifferent({
  node,
  path,
  type
}: {
  node: SignatureNode;
  path: Array<string | number>;
  type: "construct" | "call";
}) {
  return (
    <span>
      {type === "construct" ? "new " : ""}
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
        <Parameters parameters={node.parameters} path={path} />
      </AddBrackets>
      <span
        css={css`
          color: ${colors.G500};
        `}
      >
        {": "}
      </span>
      {renderNode(node.return, path.concat("return"))}
    </span>
  );
}

function PrettySignature({
  node,
  path,
  type
}: {
  node: SignatureNode;
  path: Array<string | number>;
  type: "construct" | "call";
}) {
  return (
    <span>
      {type === "construct" ? "new " : ""}
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
        <Parameters path={path} parameters={node.parameters} />
      </AddBrackets>
      <Arrow />
      {renderNode(node.return, path.concat("return"))}
    </span>
  );
}

function RenderNode({
  node,
  path
}: {
  node: MagicalNode;
  path: Array<string | number>;
}): React.ReactElement {
  return renderNode(node, path) as React.ReactElement;
}

function LazyRender({ children }: { children: () => React.ReactNode }) {
  return children() as React.ReactElement;
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
            <RenderNode path={newPath} node={node.value} />
          </AddBrackets>
        </span>
      );
    }
    case "Tuple": {
      return (
        <span>
          <TypeMeta>Tuple</TypeMeta>
          <AddBrackets initialIsShown={path} openBracket="[" closeBracket="]">
            <LazyRender>
              {() =>
                node.value.map((node, index, array) => (
                  <React.Fragment key={index}>
                    {renderNode(node, path.concat("value", index))}
                    {array.length - 1 === index ? "" : ", "}
                  </React.Fragment>
                ))
              }
            </LazyRender>
          </AddBrackets>
        </span>
      );
    }
    case "IndexedAccess": {
      return (
        <span>
          <div>{renderNode(node.object, path.concat("object"))}</div>
          <div>[{renderNode(node.index, path.concat("index"))}]</div>
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
          <AddBrackets initialIsShown={path} openBracket="<" closeBracket=">">
            <LazyRender>
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
            </LazyRender>
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
      if (
        node.callSignatures.length === 1 &&
        node.properties.length === 0 &&
        node.constructSignatures.length === 0
      ) {
        return (
          <PrettySignature
            node={node.callSignatures[0]}
            type="call"
            path={path.concat("callSignatures", 0)}
          />
        );
      }
      if (
        node.constructSignatures.length === 1 &&
        node.properties.length === 0 &&
        node.callSignatures.length === 0
      ) {
        return (
          <PrettySignature
            node={node.constructSignatures[0]}
            type="construct"
            path={path.concat("constructSignatures", 0)}
          />
        );
      }
      return (
        <span>
          <TypeMeta>{node.name}</TypeMeta>
          <AddBrackets initialIsShown={path} openBracket="{" closeBracket="}">
            <PrettyObject path={path} node={node} />
          </AddBrackets>
        </span>
      );
    }
    case "Class": {
      return (
        <span>
          <TypeMeta>class {node.name}</TypeMeta>
          <AddBrackets initialIsShown={path} openBracket="{" closeBracket="}">
            <Properties path={path} node={node} />
          </AddBrackets>
        </span>
      );
    }
    case "Conditional": {
      return (
        <span>
          {renderNode(node.check, path.concat("check"))}{" "}
          <TypeMeta>extends</TypeMeta>{" "}
          {renderNode(node.extends, path.concat("extends"))}{" "}
          <TypeMeta> ? </TypeMeta>
          {renderNode(node.true, path.concat("true"))}
          <TypeMeta> : </TypeMeta>
          {renderNode(node.false, path.concat("false"))}
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

function getPathsThatShouldBeExpandedByDefault(rootNode: MagicalNode) {
  let pathsThatShouldBeExpandedByDefault = new Set<string>();

  // because of circular references, we don't want to visit a node more than once
  let visitedNodes = new Set<MagicalNode>();

  let queue: Array<PositionedMagicalNode> = [{ node: rootNode, path: [] }];

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
      let childPositionedNodes = getChildPositionedMagicalNodes(
        currentPositionedNode
      ).filter(({ node }) => !visitedNodes.has(node));

      if (
        childPositionedNodes.length < 40 ||
        currentPositionedNode.path.length < 2
      ) {
        queue.push(...childPositionedNodes);
      }
    }
  }
  return pathsThatShouldBeExpandedByDefault;
}

let getMagicalNode = (props: any): MagicalNode => {
  return flatted.parse((props as any).__types);
};

let renderTypes = (node: MagicalNode) => {
  let pathsThatShouldBeExpandedByDefault = useMemo(() => {
    return getPathsThatShouldBeExpandedByDefault(node);
  }, [node]);

  return (
    <div css={{ fontFamily: "sans-serif" }}>
      <PathExpansionContext.Provider value={pathsThatShouldBeExpandedByDefault}>
        {renderNode(node, [])}
      </PathExpansionContext.Provider>
    </div>
  );
};

const PropTypeWrapper = (props: { children: React.ReactNode }) => (
  <div
    css={css`
      margin-top: ${gridSize * 4}px;
    `}
    {...props}
  />
);

function simplifyIntersection(node: MagicalNode): MagicalNode {
  if (node.type !== "Intersection") {
    return node;
  }
  let types = node.types;
  if (types.every(value => value.type === "Object")) {
    let objectNodes = types as ObjectNode[];
    return {
      type: "Object",
      callSignatures: flatMap(objectNodes, x => x.callSignatures),
      constructSignatures: flatMap(objectNodes, x => x.callSignatures),
      properties: flatMap(objectNodes, x => x.properties),
      name: null,
      // TODO: fix this
      aliasTypeArguments: []
    };
  }
  return node;
}

export let PropTypes = (props: {
  component: ComponentType<any>;
  heading?: string;
}) => {
  let node = getMagicalNode(props);
  let finalNode = simplifyIntersection(node);
  let pathsThatShouldBeExpandedByDefault = useMemo(() => {
    return getPathsThatShouldBeExpandedByDefault(node);
  }, [finalNode]);
  if (finalNode.type === "Object") {
    return (
      <PathExpansionContext.Provider value={pathsThatShouldBeExpandedByDefault}>
        <PropsWrapper heading={props.heading}>
          {finalNode.properties.map((prop, index) => {
            return (
              <PropTypeWrapper key={index}>
                <PropTypeHeading name={prop.key} required={prop.required} />
                {prop.description && (
                  <Description>
                    <ReactMarkdown source={prop.description} />
                  </Description>
                )}
                {renderNode(prop.value, ["properties", index, "value"])}
              </PropTypeWrapper>
            );
          })}
        </PropsWrapper>
      </PathExpansionContext.Provider>
    );
  }

  return renderTypes(node);
};

export let FunctionTypes = (props: {
  function: (...args: Array<any>) => any;
}) => {
  return renderTypes(getMagicalNode(props));
};

export function RawTypes<Type>(props: {}) {
  return renderTypes(getMagicalNode(props));
}

export * from "./types";
