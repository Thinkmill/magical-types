import {
  MagicalNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex,
  TypeParameterNode,
  LazyNode,
} from "@magical-types/types";
import { InternalError } from "@magical-types/errors";

let cache = new WeakMap<MagicalNodeWithIndexes, MagicalNode>();

let weakMemoize = function<Arg extends object, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  let cache: WeakMap<Arg, Return> = new WeakMap();
  return (arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    let ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

let memoize = function<Arg extends string | number, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  let cache: Map<Arg, Return> = new Map();
  return (arg) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    let ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

let wrapInCache = (arg: (type: MagicalNodeWithIndexes) => MagicalNode) => {
  return (type: MagicalNodeWithIndexes): MagicalNode => {
    let cachedNode = cache.get(type);
    if (cachedNode !== undefined) {
      return cachedNode;
    }
    let obj = {} as MagicalNode;
    if (typeof type !== "object") {
      throw new Error(typeof type);
    }
    cache.set(type, obj);
    let node = arg(type);
    Object.assign(obj, node);
    return obj;
  };
};

let promiseCache = new Map();
let valueCache = new Map();

function loadCachedLazyValue<Value>(
  loader: () => Promise<Value>
): Promise<void> {
  if (promiseCache.has(loader)) {
    return promiseCache.get(loader);
  }
  // if (typeof loader !== "function") debugger;
  let promise = loader().then((value) => {
    valueCache.set(loader, value);
  });
  promiseCache.set(loader, promise);
  return promise;
}

type MagicalNodeLoader = () => Promise<MagicalNodeWithIndexes[]>;

type NodeGroups = [MagicalNodeWithIndexes[], ...MagicalNodeLoader[]];

function readFromValueCache<Value>(
  loader: () => Promise<Value>
): Value | undefined {
  return valueCache.get(loader);
}

export let deserialize = weakMemoize(function parseStringified(
  nodeGroups: NodeGroups
): (node: MagicalNodeIndex) => MagicalNode {
  let getMagicalNode = wrapInCache(
    (node: MagicalNodeWithIndexes): MagicalNode => {
      switch (node.type) {
        case "Lazy":
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
            types: node.types.map((x) => getNodeFromIndex(x)),
            name: node.name,
          };
        }
        case "Intersection": {
          return {
            type: "Intersection",
            types: node.types.map((x) => getNodeFromIndex(x)),
          };
        }
        case "Array":
        case "Promise":
        case "ReadonlyArray": {
          return {
            type: node.type,
            value: getNodeFromIndex(node.value),
          };
        }
        case "Tuple": {
          return {
            type: "Tuple",
            value: node.value.map((x) => getNodeFromIndex(x)),
          };
        }
        case "IndexedAccess": {
          return {
            type: "IndexedAccess",
            index: getNodeFromIndex(node.index),
            object: getNodeFromIndex(node.object),
          };
        }
        case "Class": {
          return {
            type: "Class",
            name: node.name,
            properties: node.properties.map((x) => {
              return { ...x, value: getNodeFromIndex(x.value) };
            }),
            thisNode: node.thisNode ? getNodeFromIndex(node.thisNode) : null,
            typeParameters: node.typeParameters.map((x) => getNodeFromIndex(x)),
          };
        }
        case "Object": {
          return {
            type: "Object",
            name: node.name,
            numberIndex:
              node.numberIndex === undefined
                ? undefined
                : getNodeFromIndex(node.numberIndex),
            stringIndex:
              node.stringIndex === undefined
                ? undefined
                : getNodeFromIndex(node.stringIndex),

            properties: node.properties.map((x) => {
              return { ...x, value: getNodeFromIndex(x.value) };
            }),
            callSignatures: node.callSignatures.map((x) => {
              return {
                return: getNodeFromIndex(x.return),
                parameters: x.parameters.map((x) => ({
                  ...x,
                  type: getNodeFromIndex(x.type),
                })),
                typeParameters: x.typeParameters.map((x) =>
                  getNodeFromIndex(x)
                ) as TypeParameterNode[],
              };
            }),
            constructSignatures: node.constructSignatures.map((x) => {
              return {
                return: getNodeFromIndex(x.return),
                parameters: x.parameters.map((x) => ({
                  ...x,
                  type: getNodeFromIndex(x.type),
                })),
                typeParameters: x.typeParameters.map((x) =>
                  getNodeFromIndex(x)
                ) as TypeParameterNode[],
              };
            }),
            aliasTypeArguments: node.aliasTypeArguments.map((x) =>
              getNodeFromIndex(x)
            ) as TypeParameterNode[],
          };
        }
        case "Conditional": {
          return {
            type: "Conditional",
            check: getNodeFromIndex(node.check),
            extends: getNodeFromIndex(node.extends),
            false: getNodeFromIndex(node.false),
            true: getNodeFromIndex(node.true),
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

  let [nodes, ...allLoaders] = nodeGroups;

  let getLazyNode = memoize((index: MagicalNodeIndex) => {
    let lazyNode: LazyNode = {
      type: "Lazy",
      loader: () => {
        if (lazyNode.value) {
          return;
        }
        return loadLazyNode(index - nodes.length, lazyNode, 0);
      },
    };
    return lazyNode;
  });

  let loadLazyNode = (
    index: number,
    lazyNode: LazyNode,
    depth: number
  ): Promise<void> | undefined => {
    let loader = allLoaders[depth];

    if (!loader) {
      throw new InternalError("No node loader found at depth " + depth);
    }

    // an important thing we know here:
    // if the first group of lazy loaded nodes has not been loaded yet
    // then the node we are trying to get _will_ be in that group
    let currentGroupValue = readFromValueCache(loader);
    if (currentGroupValue === undefined) {
      return loadCachedLazyValue(loader).then(() => {
        let currentGroupNodes = readFromValueCache(loader);
        if (!currentGroupNodes) {
          throw new InternalError("no loaded nodes");
        }
        if (!currentGroupNodes[index]) {
          throw new InternalError("no node found on second group nodes");
        }
        lazyNode.value = getMagicalNode(currentGroupNodes[index]);
      });
    }
    if (currentGroupValue[index] !== undefined) {
      lazyNode.value = getMagicalNode(currentGroupValue[index]);
      return;
    }
    return loadLazyNode(index - currentGroupValue.length, lazyNode, depth + 1);
  };

  let getNodeFromIndex = (index: MagicalNodeIndex) => {
    let node: MagicalNodeWithIndexes = nodes[index];
    if (node === undefined) {
      return getLazyNode(index);
    }
    return getMagicalNode(node);
  };
  return getNodeFromIndex;
});
