import {
  MagicalNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex,
  PositionedMagicalNode,
} from "@magical-types/types";
import { InternalError } from "@magical-types/errors";
import { getChildMagicalNodes } from "@magical-types/utils";

export function chunkNodes({ nodes, nodesMeta }: SerializationResult) {
  let below5: MagicalNodeWithIndexes[] = [];
  let between5And10: MagicalNodeWithIndexes[] = [];
  let above10: MagicalNodeWithIndexes[] = [];

  for (let [, { depth, index }] of nodesMeta) {
    if (depth < 5) {
      below5.push(nodes[index]);
    } else if (depth <= 10) {
      between5And10.push(nodes[index]);
    } else {
      above10.push(nodes[index]);
    }
  }
  return [below5, between5And10, above10] as const;
}

type NodesMeta = Map<MagicalNode, { index: MagicalNodeIndex; depth: number }>;

export type SerializationResult = {
  nodes: MagicalNodeWithIndexes[];
  nodesMeta: NodesMeta;
};

export function serializeNodes(rootNodes: MagicalNode[]): SerializationResult {
  let i = 0;
  // because of circular references, we don't want to visit a node more than once
  let visitedNodes: Map<
    MagicalNode,
    { index: MagicalNodeIndex; depth: number }
  > = new Map();

  let queue: { node: MagicalNode; depth: number }[] = rootNodes.map((node) => ({
    node,
    depth: 0,
  }));

  while (queue.length) {
    let currentNode = queue.shift()!;
    if (!visitedNodes.has(currentNode.node)) {
      visitedNodes.set(currentNode.node, {
        depth: currentNode.depth,
        index: i++ as MagicalNodeIndex,
      });

      let childNodes = getChildMagicalNodes(currentNode.node);
      childNodes.forEach((node) => {
        if (!visitedNodes.has(node)) {
          queue.push({ node, depth: currentNode.depth + 1 });
        }
      });
    }
  }

  let newNodes: MagicalNodeWithIndexes[] = [];
  for (let [node] of visitedNodes) {
    newNodes.push(getMagicalNodeWithIndexes(node, visitedNodes));
  }
  return { nodes: newNodes, nodesMeta: visitedNodes };
}

function getMagicalNodeWithIndexes(
  node: MagicalNode,
  visitedNodes: Map<MagicalNode, { index: MagicalNodeIndex }>
): MagicalNodeWithIndexes {
  let getIndexForNode: (node: MagicalNode) => MagicalNodeIndex = (node) => {
    let info = visitedNodes.get(node);
    if (!info) {
      throw new InternalError(
        "Could not get index for node of type: " + node.type
      );
    }
    return info.index;
  };
  switch (node.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "TypeParameter":
    case "Symbol":
    case "Error":
    case "Intrinsic": {
      return node;
    }
    case "Union": {
      return {
        type: "Union",
        types: node.types.map((x) => getIndexForNode(x)),
        name: node.name,
      };
    }
    case "Intersection": {
      return {
        type: "Intersection",
        name: node.name,
        types: node.types.map((x) => getIndexForNode(x)),
      };
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return {
        type: node.type,
        value: getIndexForNode(node.value),
      };
    }
    case "Tuple": {
      return {
        type: "Tuple",
        value: node.value.map((x) => getIndexForNode(x)),
      };
    }
    case "IndexedAccess": {
      return {
        type: "IndexedAccess",
        index: getIndexForNode(node.index),
        object: getIndexForNode(node.object),
      };
    }
    case "Class": {
      return {
        type: "Class",
        name: node.name,
        properties: node.properties.map((x) => {
          return { ...x, value: getIndexForNode(x.value) };
        }),
        thisNode: node.thisNode ? getIndexForNode(node.thisNode) : undefined,
        typeParameters: node.typeParameters.map((x) => getIndexForNode(x)),
      };
    }
    case "Object": {
      return {
        type: "Object",
        name: node.name,
        numberIndex: node.numberIndex
          ? getIndexForNode(node.numberIndex)
          : undefined,
        stringIndex: node.stringIndex
          ? getIndexForNode(node.stringIndex)
          : undefined,
        properties: node.properties.map((x) => {
          return { ...x, value: getIndexForNode(x.value) };
        }),
        callSignatures: node.callSignatures.map((x) => {
          return {
            return: getIndexForNode(x.return),
            parameters: x.parameters.map((x) => ({
              ...x,
              type: getIndexForNode(x.type),
            })),
            typeParameters: x.typeParameters.map((x) => getIndexForNode(x)),
          };
        }),
        constructSignatures: node.constructSignatures.map((x) => {
          return {
            return: getIndexForNode(x.return),
            parameters: x.parameters.map((x) => ({
              ...x,
              type: getIndexForNode(x.type),
            })),
            typeParameters: x.typeParameters.map((x) => getIndexForNode(x)),
          };
        }),
        aliasTypeArguments: node.aliasTypeArguments.map((x) =>
          getIndexForNode(x)
        ),
      };
    }
    case "Conditional": {
      return {
        type: "Conditional",
        check: getIndexForNode(node.check),
        extends: getIndexForNode(node.extends),
        false: getIndexForNode(node.false),
        true: getIndexForNode(node.true),
      };
    }
    case "Lazy": {
      throw new InternalError("Lazy nodes cannot be serialized");
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new Error("this should never happen: " + node.type);
    }
  }
}
