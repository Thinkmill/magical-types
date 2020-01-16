import React, { useEffect, useReducer, useMemo, useState } from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import ReactMarkdown from "react-markdown";
import {
  MagicalNode,
  ObjectNode,
  ClassNode,
  TypeParameterNode,
  SignatureNode,
  PositionedMagicalNode,
  Parameter,
  LazyNode
} from "@magical-types/types";
import {
  Type,
  Indent,
  StringType,
  TypeMeta,
  Description,
  Required
} from "./pretty-proptypes/components";
import { colors, gridSize } from "./pretty-proptypes/components/constants";
import AddBrackets, {
  bracketStyle,
  PathExpansionContext
} from "./pretty-proptypes/PrettyConvert/AddBrackets";
import { getChildPositionedMagicalNodes, flatMap } from "@magical-types/utils";
import PropTypeHeading from "./pretty-proptypes/Prop/Heading";
import PropsWrapper from "./pretty-proptypes/Props/Wrapper";

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
            {prop.required ? <Required> required</Required> : null}{" "}
            <RenderNode
              node={prop.value}
              path={path.concat("properties", index, "value")}
            />
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
          <PrettySignature
            key={index}
            node={signature}
            funcType="colon"
            path={path.concat("constructSignatures", index)}
            type="construct"
          />
        );
      })}
      {node.callSignatures.map((signature, index) => {
        return (
          <PrettySignature
            key={index}
            node={signature}
            funcType="colon"
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
            <RenderNode
              node={prop.value}
              path={path.concat("properties", index, "value")}
            />
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
          <RenderNode
            node={param.type}
            path={path.concat("parameters", index, "type")}
          />
          {array.length - 1 === index ? "" : ", "}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

function PrettySignature({
  node,
  path,
  type,
  funcType
}: {
  node: SignatureNode;
  path: Array<string | number>;
  type: "construct" | "call";
  funcType: "arrow" | "colon";
}) {
  return (
    <span>
      {type === "construct" ? "new " : ""}
      {node.typeParameters.length !== 0 && (
        <span>
          <span css={bracketStyle({ isHovered: false })}>{"<"}</span>
          {node.typeParameters.map((param, index, array) => (
            <React.Fragment key={index}>
              <RenderNode
                node={param}
                path={path.concat("typeParameters", index)}
              />
              {array.length - 1 === index ? "" : ", "}
            </React.Fragment>
          ))}
          <span css={bracketStyle({ isHovered: false })}>{">"}</span>
        </span>
      )}
      <AddBrackets nodes={node.parameters.map(x => x.type)}>
        <Parameters parameters={node.parameters} path={path} />
      </AddBrackets>
      {funcType === "arrow" ? (
        <Arrow />
      ) : (
        <span
          css={css`
            color: ${colors.G500};
          `}
        >
          {": "}
        </span>
      )}
      <AddBrackets nodes={[node.return]} openBracket="" closeBracket="">
        <RenderNode node={node.return} path={path.concat("return")} />
      </AddBrackets>
    </span>
  );
}

let RenderNode: (props: {
  node: MagicalNode;
  path: Array<string | number>;
}) => React.ReactElement = function RenderNode({ node, path }): any {
  if (path.length > 2000) {
    return "This node has a path of greater than 2000, this is mostly likely because of a bug in Magical Types";
  }
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
            nodes={[node.value]}
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
          <AddBrackets
            nodes={node.value}
            initialIsShown={path}
            openBracket="["
            closeBracket="]"
          >
            {node.value.map((node, index, array) => (
              <React.Fragment key={index}>
                <RenderNode node={node} path={path.concat("value", index)} />
                {array.length - 1 === index ? "" : ", "}
              </React.Fragment>
            ))}
          </AddBrackets>
        </span>
      );
    }
    case "IndexedAccess": {
      return (
        <span>
          <div>
            <RenderNode node={node.object} path={path.concat("object")} />
          </div>
          <div>
            [<RenderNode node={node.index} path={path.concat("index")} />]
          </div>
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
            nodes={node.types}
            initialIsShown={path}
            openBracket="<"
            closeBracket=">"
          >
            <Indent>
              {node.types.map((n, index, array) => (
                <div key={index}>
                  <RenderNode node={n} path={path.concat("types", index)} />
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
        arr.push(
          <span key={index}>
            <RenderNode node={type} path={path.concat("types", index)} />
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
            funcType="arrow"
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
            funcType="arrow"
            path={path.concat("constructSignatures", 0)}
          />
        );
      }

      return (
        <span>
          <TypeMeta>{node.name}</TypeMeta>
          {node.callSignatures.length ||
          node.constructSignatures.length ||
          node.properties.length ? (
            <AddBrackets
              nodes={getChildPositionedMagicalNodes({
                node,
                path: [],
                depth: 0
              }).map(x => x.node)}
              initialIsShown={false}
              openBracket="{"
              closeBracket="}"
            >
              <PrettyObject path={path} node={node} />
            </AddBrackets>
          ) : (
            <span css={bracketStyle({ isHovered: false })}>{"{}"}</span>
          )}
        </span>
      );
    }
    case "Class": {
      return (
        <span>
          <TypeMeta>class {node.name}</TypeMeta>
          <AddBrackets
            nodes={null}
            initialIsShown={path}
            openBracket="{"
            closeBracket="}"
          >
            <Properties path={path} node={node} />
          </AddBrackets>
        </span>
      );
    }
    case "Conditional": {
      return (
        <span>
          <RenderNode node={node.check} path={path.concat("check")} />{" "}
          <TypeMeta>extends</TypeMeta>{" "}
          <RenderNode node={node.extends} path={path.concat("extends")} />{" "}
          <TypeMeta> ? </TypeMeta>
          <RenderNode node={node.true} path={path.concat("true")} />
          <TypeMeta> : </TypeMeta>
          <RenderNode node={node.false} path={path.concat("false")} />
        </span>
      );
    }
    case "Symbol": {
      return (
        <span>
          <TypeMeta>
            Symbol(
            <span css={{ color: colors.P300 }}>{node.name}</span>)
          </TypeMeta>
        </span>
      );
    }
    case "Lazy": {
      return <LazyNodeView node={node} path={path} />;
    }
    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
    }
  }
};

function LazyNodeView({
  node,
  path
}: {
  node: LazyNode;
  path: Array<number | string>;
}) {
  let promise = node.loader();

  let value = node.value;
  let [, setState] = useState({});

  useEffect(() => {
    if (promise !== undefined) {
      promise.then(() => {
        setState({});
      });
    }
  }, [promise]);

  if (value !== undefined) {
    return <RenderNode node={value} path={path.concat("value")} />;
  }
  return <React.Fragment>Loading...</React.Fragment>;
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

  let queue: Array<PositionedMagicalNode> = [
    { node: rootNode, path: [], depth: 0 }
  ];

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
    if (currentPositionedNode.depth < 3) {
      let childPositionedNodes = getChildPositionedMagicalNodes(
        currentPositionedNode
      ).filter(({ node }) => !visitedNodes.has(node));
      if (childPositionedNodes.length < 20 || currentPositionedNode.depth < 2) {
        queue.push(...childPositionedNodes);
      }
    }
  }
  return pathsThatShouldBeExpandedByDefault;
}

export let renderTypes = (node: MagicalNode) => {
  let pathsThatShouldBeExpandedByDefault = useMemo(() => {
    return getPathsThatShouldBeExpandedByDefault(node);
  }, [node]);

  return (
    <div
      css={{
        fontFamily:
          "source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace"
      }}
    >
      <PathExpansionContext.Provider value={pathsThatShouldBeExpandedByDefault}>
        <RenderNode node={node} path={[]} />
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

export function Types({ node }: { node: MagicalNode }) {
  return renderTypes(node);
}

export function PropTypes({
  node,
  heading
}: {
  node: MagicalNode;
  heading?: string;
}) {
  node = simplifyIntersection(node);
  let pathsThatShouldBeExpandedByDefault = useMemo(() => {
    return getPathsThatShouldBeExpandedByDefault(node);
  }, [node]);
  if (node.type === "Object") {
    return (
      <PathExpansionContext.Provider value={pathsThatShouldBeExpandedByDefault}>
        <PropsWrapper heading={heading}>
          {node.properties.map((prop, index) => {
            return (
              <PropTypeWrapper key={index}>
                <PropTypeHeading name={prop.key} required={prop.required} />
                {prop.description && (
                  <Description>
                    <ReactMarkdown source={prop.description} />
                  </Description>
                )}
                <RenderNode
                  node={prop.value}
                  path={["properties", index, "value"]}
                />
              </PropTypeWrapper>
            );
          })}
        </PropsWrapper>
      </PathExpansionContext.Provider>
    );
  }
  return renderTypes(node);
}
