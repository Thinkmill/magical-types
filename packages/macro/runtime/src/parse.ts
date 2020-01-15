import {
  MagicalNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex,
  TypeParameterNode,
  LazyNode
} from "@magical-types/types";
import { InternalError } from "@magical-types/errors/src";

let cache = new WeakMap<MagicalNodeWithIndexes, MagicalNode>();

let weakMemoize = function<Arg extends object, Return>(
  func: (arg: Arg) => Return
): (arg: Arg) => Return {
  let cache: WeakMap<Arg, Return> = new WeakMap();
  return arg => {
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
  return arg => {
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
  let promise = loader().then(value => {
    valueCache.set(loader, value);
  });
  promiseCache.set(loader, promise);
  return promise;
}

type NodeGroups =
  | MagicalNodeWithIndexes[]
  | [
      MagicalNodeWithIndexes[],
      () => Promise<{ default: MagicalNodeWithIndexes[] }>
    ]
  | [
      MagicalNodeWithIndexes[],
      () => Promise<{ default: MagicalNodeWithIndexes[] }>,
      () => Promise<{ default: MagicalNodeWithIndexes[] }>
    ];

function readFromValueCache<Value>(
  loader: () => Promise<Value>
): Value | undefined {
  return valueCache.get(loader);
}

export let parseStringified = weakMemoize(function parseStringified(
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
        case "Intrinsic": {
          // @ts-ignore
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

  let nodes = (Array.isArray(nodeGroups[0])
    ? nodeGroups[0]
    : nodeGroups) as MagicalNodeWithIndexes[];

  let getLazyNode = memoize((index: MagicalNodeIndex) => {
    let lazyNode: LazyNode = {
      type: "Lazy",
      loader: () => {
        if (lazyNode.value) {
          return;
        }
        let secondGroupLoader = (nodeGroups[1] as any) as () => Promise<{
          default: MagicalNodeWithIndexes[];
        }>;
        // an important thing we know here:
        // if the first group of lazy loaded nodes has not been loaded yet
        // then the node we are trying to get _will_ be in that
        let secondGroupValue = readFromValueCache(secondGroupLoader);
        let indexOnSecondGroup = index - nodes.length;
        if (secondGroupValue === undefined) {
          return loadCachedLazyValue(secondGroupLoader).then(() => {
            let secondGroupNodes = readFromValueCache(secondGroupLoader);
            if (!secondGroupNodes) {
              throw new InternalError("no second group nodes");
            }
            if (!secondGroupNodes.default[indexOnSecondGroup]) {
              throw new InternalError("no node found on second group nodes");
            }
            lazyNode.value = getMagicalNode(
              secondGroupNodes.default[indexOnSecondGroup]
            );
          });
        }
        if (index <= nodes.length + secondGroupValue.default.length - 1) {
          lazyNode.value = getMagicalNode(
            secondGroupValue.default[indexOnSecondGroup]
          );
          return;
        }
        let thirdGroupLoader = (nodeGroups[2] as any) as () => Promise<{
          default: MagicalNodeWithIndexes[];
        }>;
        let thirdGroupValue = readFromValueCache(thirdGroupLoader);
        let indexOnThirdGroup =
          index - nodes.length - secondGroupValue.default.length;
        if (thirdGroupValue === undefined) {
          return loadCachedLazyValue(thirdGroupLoader).then(() => {
            let thirdGroupNodes = readFromValueCache(thirdGroupLoader);
            if (!thirdGroupNodes) {
              throw new InternalError("no third group nodes");
            }
            if (!thirdGroupNodes.default[indexOnThirdGroup]) {
              throw new InternalError("no node found on third group nodes");
            }
            lazyNode.value = getMagicalNode(
              thirdGroupNodes.default[indexOnThirdGroup]
            );
          });
        }
        lazyNode.value = getMagicalNode(
          thirdGroupValue.default[indexOnThirdGroup]
        );
      }
    };
    return lazyNode;
  });

  let getNodeFromIndex = (index: MagicalNodeIndex) => {
    let node: MagicalNodeWithIndexes = nodes[index];
    if (node === undefined) {
      return getLazyNode(index);
    }
    return getMagicalNode(node);
  };
  return getNodeFromIndex;
});
