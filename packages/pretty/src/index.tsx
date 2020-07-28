import React, {
  useEffect,
  useReducer,
  useMemo,
  useState,
  Fragment,
  ReactElement,
  useContext,
} from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import ReactMarkdown from "react-markdown";
import {
  MagicalNode,
  ObjectNode,
  TypeParameterNode,
  SignatureNode,
  PositionedMagicalNode,
  Parameter,
  LazyNode,
} from "@magical-types/types";
import {
  Type,
  Indent,
  StringType,
  TypeMeta,
  Description,
  Required,
} from "./pretty-proptypes/components";
import { colors, gridSize } from "./pretty-proptypes/components/constants";
import AddBrackets, {
  bracketStyle,
  PathExpansionContext,
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

function PrettyObject({
  node,
  path,
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
            <PrettyMagicalNode
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
        (x) => x !== forceUpdate
      );
    };
  }, []);

  return (
    <Type
      css={bracketStyle({ isHovered: val.value })}
      onMouseEnter={() => {
        workingValue.value = true;
        workingValue.listeners.forEach((listener) => {
          listener();
        });
      }}
      onMouseLeave={() => {
        workingValue.value = false;
        workingValue.listeners.forEach((listener) => {
          listener();
        });
      }}
    >
      {node.value}
    </Type>
  );
}

export function Parameters({
  parameters,
  path,
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
          <PrettyMagicalNode
            node={param.type}
            path={path.concat("parameters", index, "type")}
          />
          {array.length - 1 === index ? "" : ", "}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

type MagicalNodeType = MagicalNode["type"];

export type MagicalNodeRenderers = {
  [Key in MagicalNodeType]: (props: {
    node: Extract<MagicalNode, { type: Key }>;
    path: Array<string | number>;
  }) => ReactElement | null;
};

function SimpleGenericRenderer({
  node,
  path,
}: {
  node: { type: string; value: MagicalNode };
  path: Array<string | number>;
}) {
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
        <PrettyMagicalNode path={newPath} node={node.value} />
      </AddBrackets>
    </span>
  );
}

export const defaultRenderers: MagicalNodeRenderers = {
  NumberLiteral({ node }) {
    return <Type>{node.value}</Type>;
  },
  Intrinsic({ node }) {
    return <Type>{node.value}</Type>;
  },
  StringLiteral({ node }) {
    return <StringType>"{node.value}"</StringType>;
  },
  Array: SimpleGenericRenderer,
  ReadonlyArray: SimpleGenericRenderer,
  Promise: SimpleGenericRenderer,
  Tuple({ node, path }) {
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
              <PrettyMagicalNode
                node={node}
                path={path.concat("value", index)}
              />
              {array.length - 1 === index ? "" : ", "}
            </React.Fragment>
          ))}
        </AddBrackets>
      </span>
    );
  },
  IndexedAccess({ node, path }) {
    return (
      <span>
        <TypeMeta>IndexedAccess</TypeMeta>
        <AddBrackets
          nodes={null}
          initialIsShown
          openBracket="<"
          closeBracket=">"
        >
          <Indent>
            <PrettyMagicalNode
              node={node.object}
              path={path.concat("object")}
            />
            <PrettyMagicalNode node={node.index} path={path.concat("index")} />
          </Indent>
        </AddBrackets>
      </span>
    );
  },
  TypeParameter: PrettyTypeParameter,
  Union({ node, path }) {
    return (
      <span>
        <TypeMeta>{node.name === null ? "" : `${node.name} `}One of </TypeMeta>
        <AddBrackets
          nodes={node.types}
          initialIsShown={path}
          openBracket="<"
          closeBracket=">"
        >
          <Indent>
            {node.types.map((n, index, array) => (
              <div key={index}>
                <PrettyMagicalNode
                  node={n}
                  path={path.concat("types", index)}
                />
                {array.length - 1 === index ? "" : ", "}
              </div>
            ))}
          </Indent>
        </AddBrackets>
      </span>
    );
  },
  Intersection({ node, path }) {
    return (
      <span>
        <TypeMeta>Intersection</TypeMeta>
        <AddBrackets
          nodes={node.types}
          initialIsShown={path}
          openBracket="<"
          closeBracket=">"
        >
          <Indent>
            {node.types.map((n, index, array) => (
              <div key={index}>
                <PrettyMagicalNode
                  node={n}
                  path={path.concat("types", index)}
                />
                {array.length - 1 === index ? "" : ", "}
              </div>
            ))}
          </Indent>
        </AddBrackets>
      </span>
    );
  },
  Object: function ObjectRenderer({ node, path }) {
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
              depth: 0,
            }).map((x) => x.node)}
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
  },
  Class({ node, path }) {
    return (
      <span>
        <TypeMeta>class {node.name}</TypeMeta>
        <AddBrackets
          nodes={null}
          initialIsShown={path}
          openBracket="{"
          closeBracket="}"
        >
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
                  <PrettyMagicalNode
                    node={prop.value}
                    path={path.concat("properties", index, "value")}
                  />
                </div>
              );
            })}
          </Indent>
        </AddBrackets>
      </span>
    );
  },
  Conditional({ node, path }) {
    return (
      <span>
        <PrettyMagicalNode node={node.check} path={path.concat("check")} />{" "}
        <TypeMeta>extends</TypeMeta>{" "}
        <PrettyMagicalNode node={node.extends} path={path.concat("extends")} />{" "}
        <TypeMeta> ? </TypeMeta>
        <PrettyMagicalNode node={node.true} path={path.concat("true")} />
        <TypeMeta> : </TypeMeta>
        <PrettyMagicalNode node={node.false} path={path.concat("false")} />
      </span>
    );
  },
  Symbol({ node }) {
    return (
      <span>
        <TypeMeta>
          Symbol(
          <span css={{ color: colors.P300 }}>{node.name}</span>)
        </TypeMeta>
      </span>
    );
  },
  Lazy: LazyNodeView,
  Error() {
    return (
      <Type>An error occurred when serialising the types at this location</Type>
    );
  },
};

export const RenderersContext = React.createContext(defaultRenderers);

export function PrettySignature({
  node,
  path,
  type,
  funcType,
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
              <PrettyMagicalNode
                node={param}
                path={path.concat("typeParameters", index)}
              />
              {array.length - 1 === index ? "" : ", "}
            </React.Fragment>
          ))}
          <span css={bracketStyle({ isHovered: false })}>{">"}</span>
        </span>
      )}
      <AddBrackets nodes={node.parameters.map((x) => x.type)}>
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
        <PrettyMagicalNode node={node.return} path={path.concat("return")} />
      </AddBrackets>
    </span>
  );
}

export let PrettyMagicalNode = function RenderNode({
  node,
  path,
}: {
  node: MagicalNode;
  path: Array<string | number>;
}): ReactElement | null {
  if (path.length > 2000) {
    return (
      <Fragment>
        This node has a path of greater than 2000, this is mostly likely because
        of a bug in Magical Types
      </Fragment>
    );
  }

  let renderers = useContext(RenderersContext);
  let Renderer = renderers[node.type];
  return <Renderer node={node as never} path={path} />;
};

function LazyNodeView({
  node,
  path,
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
    return <PrettyMagicalNode node={value} path={path.concat("value")} />;
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
    { node: rootNode, path: [], depth: 0 },
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

export let Types = ({ node }: { node: MagicalNode }) => {
  let pathsThatShouldBeExpandedByDefault = useMemo(() => {
    return getPathsThatShouldBeExpandedByDefault(node);
  }, [node]);

  return (
    <div
      css={{
        fontFamily:
          "source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace",
      }}
    >
      <PathExpansionContext.Provider value={pathsThatShouldBeExpandedByDefault}>
        <PrettyMagicalNode node={node} path={[]} />
      </PathExpansionContext.Provider>
    </div>
  );
};

export const PropTypeWrapper = (props: { children: React.ReactNode }) => (
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
  if (types.every((value) => value.type === "Object")) {
    let objectNodes = types as ObjectNode[];
    return {
      type: "Object",
      callSignatures: flatMap(objectNodes, (x) => x.callSignatures),
      constructSignatures: flatMap(objectNodes, (x) => x.callSignatures),
      properties: flatMap(objectNodes, (x) => x.properties),
      name: null,
      // TODO: fix this
      aliasTypeArguments: [],
    };
  }
  return node;
}

export function PropTypes({ node }: { node: MagicalNode }) {
  node = simplifyIntersection(node);
  let pathsThatShouldBeExpandedByDefault = useMemo(() => {
    return getPathsThatShouldBeExpandedByDefault(node);
  }, [node]);
  if (node.type === "Object") {
    return (
      <PathExpansionContext.Provider value={pathsThatShouldBeExpandedByDefault}>
        <PropsWrapper>
          {node.properties.map((prop, index) => {
            return (
              <PropTypeWrapper key={index}>
                <PropTypeHeading name={prop.key} required={prop.required} />
                {prop.description && (
                  <Description>
                    <ReactMarkdown source={prop.description} />
                  </Description>
                )}
                <PrettyMagicalNode
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
  return <Types node={node} />;
}
export { AddBrackets, TypeMeta, Type, PropTypeHeading, Description };
