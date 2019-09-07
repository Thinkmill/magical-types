import { MagicalNode, HashedMagicalNode, MagicalNodeHash } from "./types";
import * as flatted from "flatted";
import Deque from "double-ended-queue";
import crypto from "crypto";
import { h64 as hashStr } from "./hash";
import { getChildPositionedMagicalNodes } from "./utils";

crypto.createHash("sha256");

let weakMemoize = function<Arg, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  // @ts-ignore
  let cache: WeakMap<Arg, Return> = new WeakMap();
  // @ts-ignore
  return arg => {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }
    let ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

export let getHashForNode = weakMemoize((node: MagicalNode) => {
  let stringified = flatted.stringify(node);
  return hashStr(stringified) as MagicalNodeHash;
});

export function serializeNodes(rootNodes: MagicalNode[]) {
  // because of circular references, we don't want to visit a node more than once
  let visitedNodes = new Set<MagicalNode>();

  let queue = new Deque(rootNodes);

  while (queue.length) {
    let currentNode = queue.shift()!;

    visitedNodes.add(currentNode);

    // we don't want to open any nodes deeper than 5 nodes by default
    let childPositionedNodes = getChildPositionedMagicalNodes({
      node: currentNode,
      path: []
    }).filter(({ node }) => !visitedNodes.has(node));

    queue.push(...childPositionedNodes.map(x => x.node));
  }
  let newNodes: HashedMagicalNode[] = [];
  let visitedNodesArray: MagicalNode[] = [...visitedNodes];
  visitedNodes.forEach(node => {
    newNodes.push(getHashedNode(node));
  });
  return { hashedNodes: newNodes, nodes: visitedNodesArray };
}

function getHashedNode(node: MagicalNode): HashedMagicalNode {
  switch (node.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "TypeParameter":
    case "Intrinsic": {
      return node;
    }
    case "Union": {
      return {
        type: "Union",
        types: node.types.map(x => getHashForNode(x)),
        name: node.name
      };
    }
    case "Intersection": {
      return {
        type: "Intersection",
        types: node.types.map(x => getHashForNode(x))
      };
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return {
        type: node.type,
        value: getHashForNode(node.value)
      };
    }
    case "Tuple": {
      return {
        type: "Tuple",
        value: node.value.map(x => getHashForNode(x))
      };
    }
    case "IndexedAccess": {
      return {
        type: "IndexedAccess",
        index: getHashForNode(node.index),
        object: getHashForNode(node.object)
      };
    }
    case "Class": {
      return {
        type: "Class",
        name: node.name,
        properties: node.properties.map(x => {
          return { ...x, value: getHashForNode(x.value) };
        }),
        thisNode: node.thisNode ? getHashForNode(node.thisNode) : null,
        typeParameters: node.typeParameters.map(x => getHashForNode(x))
      };
    }
    case "Object": {
      return {
        type: "Object",
        name: node.name,
        properties: node.properties.map(x => {
          return { ...x, value: getHashForNode(x.value) };
        }),
        callSignatures: node.callSignatures.map(x => {
          return {
            return: getHashForNode(x.return),
            parameters: x.parameters.map(x => ({
              ...x,
              type: getHashForNode(x.type)
            })),
            typeParameters: x.typeParameters.map(x => getHashForNode(x))
          };
        }),
        constructSignatures: node.constructSignatures.map(x => {
          return {
            return: getHashForNode(x.return),
            parameters: x.parameters.map(x => ({
              ...x,
              type: getHashForNode(x.type)
            })),
            typeParameters: x.typeParameters.map(x => getHashForNode(x))
          };
        }),
        aliasTypeArguments: node.aliasTypeArguments.map(x => getHashForNode(x))
      };
    }
    case "Conditional": {
      return {
        type: "Conditional",
        check: getHashForNode(node.check),
        extends: getHashForNode(node.extends),
        false: getHashForNode(node.false),
        true: getHashForNode(node.true)
      };
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new Error("this should never happen: " + node.type);
    }
  }
}
