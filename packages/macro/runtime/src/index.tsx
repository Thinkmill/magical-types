import { Types, PropTypes as PrettyPropTypes } from "@magical-types/pretty";
import * as React from "react";
import {
  MagicalNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex,
  TypeParameterNode
} from "@magical-types/types";

let wrapInCache = <Arg extends object, Return>(arg: (type: Arg) => Return) => {
  let cache = new WeakMap<Arg, Return>();
  return (type: Arg): Return => {
    let cachedNode = cache.get(type);
    if (cachedNode !== undefined) {
      return cachedNode;
    }
    let obj = {} as Return;
    cache.set(type, obj);
    let node = arg(type);
    Object.assign(obj, node);
    return obj;
  };
};

function parseStringified(
  nodes: MagicalNodeWithIndexes[],
  index: MagicalNodeIndex
): MagicalNode {
  let getMagicalNodeWithIndexes = wrapInCache(
    (node: MagicalNodeWithIndexes): MagicalNode => {
      switch (node.type) {
        case "StringLiteral":
        case "NumberLiteral":
        case "TypeParameter":
        case "Symbol":
        case "Intrinsic": {
          return node;
        }
        case "Union": {
          return {
            type: "Union",
            types: node.types.map(x => getNodeFromIndex(x)),
            name: node.name
          };
        }
        case "Intersection": {
          return {
            type: "Intersection",
            types: node.types.map(x => getNodeFromIndex(x))
          };
        }
        case "Array":
        case "Promise":
        case "ReadonlyArray": {
          return {
            type: node.type,
            value: getNodeFromIndex(node.value)
          };
        }
        case "Tuple": {
          return {
            type: "Tuple",
            value: node.value.map(x => getNodeFromIndex(x))
          };
        }
        case "IndexedAccess": {
          return {
            type: "IndexedAccess",
            index: getNodeFromIndex(node.index),
            object: getNodeFromIndex(node.object)
          };
        }
        case "Class": {
          return {
            type: "Class",
            name: node.name,
            properties: node.properties.map(x => {
              return { ...x, value: getNodeFromIndex(x.value) };
            }),
            thisNode: node.thisNode ? getNodeFromIndex(node.thisNode) : null,
            typeParameters: node.typeParameters.map(x => getNodeFromIndex(x))
          };
        }
        case "Object": {
          return {
            type: "Object",
            name: node.name,
            properties: node.properties.map(x => {
              return { ...x, value: getNodeFromIndex(x.value) };
            }),
            callSignatures: node.callSignatures.map(x => {
              return {
                return: getNodeFromIndex(x.return),
                parameters: x.parameters.map(x => ({
                  ...x,
                  type: getNodeFromIndex(x.type)
                })),
                typeParameters: x.typeParameters.map(x =>
                  getNodeFromIndex(x)
                ) as TypeParameterNode[]
              };
            }),
            constructSignatures: node.constructSignatures.map(x => {
              return {
                return: getNodeFromIndex(x.return),
                parameters: x.parameters.map(x => ({
                  ...x,
                  type: getNodeFromIndex(x.type)
                })),
                typeParameters: x.typeParameters.map(x =>
                  getNodeFromIndex(x)
                ) as TypeParameterNode[]
              };
            }),
            aliasTypeArguments: node.aliasTypeArguments.map(x =>
              getNodeFromIndex(x)
            ) as TypeParameterNode[]
          };
        }
        case "Conditional": {
          return {
            type: "Conditional",
            check: getNodeFromIndex(node.check),
            extends: getNodeFromIndex(node.extends),
            false: getNodeFromIndex(node.false),
            true: getNodeFromIndex(node.true)
          };
        }

        default: {
          let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
          // @ts-ignore
          throw new Error("this should never happen: " + node.type);
        }
      }
    }
  );

  let getNodeFromIndex = (index: MagicalNodeIndex) =>
    getMagicalNodeWithIndexes(nodes[index]);
  return getNodeFromIndex(index);
}

let getMagicalNode = (props: any): MagicalNode => {
  return parseStringified((props as any).__types, props.__typeIndex);
};

export let FunctionTypes = (props: {
  function: (...args: Array<any>) => any;
}) => {
  return <Types node={getMagicalNode(props)} />;
};

export function RawTypes<Type>(props: {}) {
  return <Types node={getMagicalNode(props)} />;
}

export let PropTypes = (props: {
  component: React.ComponentType<any>;
  heading?: string;
}) => {
  let node = getMagicalNode(props);
  return <PrettyPropTypes node={node} heading={props.heading} />;
};

export function getNode<Type>() {
  return parseStringified(arguments[0], arguments[1]);
}
