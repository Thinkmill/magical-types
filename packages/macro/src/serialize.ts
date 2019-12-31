import {
  MagicalNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex
} from "@magical-types/types";
import { getChildPositionedMagicalNodes } from "./utils";

let weakMemoize = function<Arg, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  // @ts-ignore
  let cache: WeakMap<Arg, Return> = new WeakMap();
  // @ts-ignore
  return arg => {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    let ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

export function serializeNodes(rootNodes: MagicalNode[]) {
  let i = 0;

  // because of circular references, we don't want to visit a node more than once
  let visitedNodes = new Map<MagicalNode, MagicalNodeIndex>();

  let queue = [...rootNodes];

  while (queue.length) {
    let currentNode = queue.shift()!;
    if (!visitedNodes.has(currentNode)) {
      visitedNodes.set(currentNode, i++ as MagicalNodeIndex);

      let childPositionedNodes = getChildPositionedMagicalNodes({
        node: currentNode,
        path: []
      });

      queue.push(...childPositionedNodes.map(x => x.node));
    }
  }
  let newNodes: MagicalNodeWithIndexes[] = [];
  for (let [node] of visitedNodes) {
    newNodes.push(getMagicalNodeWithIndexes(node, visitedNodes));
  }
  return { nodes: newNodes, nodesToIndex: visitedNodes };
}

function getMagicalNodeWithIndexes(
  node: MagicalNode,
  visitedNodes: Map<MagicalNode, MagicalNodeIndex>
): MagicalNodeWithIndexes {
  let getIndexForNode: (node: MagicalNode) => MagicalNodeIndex = node =>
    visitedNodes.get(node)!;
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
        types: node.types.map(x => getIndexForNode(x)),
        name: node.name
      };
    }
    case "Intersection": {
      return {
        type: "Intersection",
        types: node.types.map(x => getIndexForNode(x))
      };
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return {
        type: node.type,
        value: getIndexForNode(node.value)
      };
    }
    case "Tuple": {
      return {
        type: "Tuple",
        value: node.value.map(x => getIndexForNode(x))
      };
    }
    case "IndexedAccess": {
      return {
        type: "IndexedAccess",
        index: getIndexForNode(node.index),
        object: getIndexForNode(node.object)
      };
    }
    case "Class": {
      return {
        type: "Class",
        name: node.name,
        properties: node.properties.map(x => {
          return { ...x, value: getIndexForNode(x.value) };
        }),
        thisNode: node.thisNode ? getIndexForNode(node.thisNode) : null,
        typeParameters: node.typeParameters.map(x => getIndexForNode(x))
      };
    }
    case "Object": {
      return {
        type: "Object",
        name: node.name,
        properties: node.properties.map(x => {
          return { ...x, value: getIndexForNode(x.value) };
        }),
        callSignatures: node.callSignatures.map(x => {
          return {
            return: getIndexForNode(x.return),
            parameters: x.parameters.map(x => ({
              ...x,
              type: getIndexForNode(x.type)
            })),
            typeParameters: x.typeParameters.map(x => getIndexForNode(x))
          };
        }),
        constructSignatures: node.constructSignatures.map(x => {
          return {
            return: getIndexForNode(x.return),
            parameters: x.parameters.map(x => ({
              ...x,
              type: getIndexForNode(x.type)
            })),
            typeParameters: x.typeParameters.map(x => getIndexForNode(x))
          };
        }),
        aliasTypeArguments: node.aliasTypeArguments.map(x => getIndexForNode(x))
      };
    }
    case "Conditional": {
      return {
        type: "Conditional",
        check: getIndexForNode(node.check),
        extends: getIndexForNode(node.extends),
        false: getIndexForNode(node.false),
        true: getIndexForNode(node.true)
      };
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new Error("this should never happen: " + node.type);
    }
  }
}
