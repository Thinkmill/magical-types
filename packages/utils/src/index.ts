import { PositionedMagicalNode, MagicalNode } from "@magical-types/types";
import { InternalError } from "@magical-types/errors";

export let weakMemoize = function<Arg extends object, Return>(
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

type Options = {
  ignoreUnloadedLazyNodes?: boolean;
};

export function getChildPositionedMagicalNodes(
  { node, path, depth }: PositionedMagicalNode,
  { ignoreUnloadedLazyNodes = false }: Options = {}
): Array<PositionedMagicalNode> {
  depth++;
  function getPositionedNodeFromKey<Obj, Key extends keyof Obj>(
    obj: Obj,
    key: Key
  ): {
    node: Obj[Key];
    path: Array<string | number>;
    depth: number;
  } {
    return { node: obj[key], path: path.concat(key as string | number), depth };
  }
  switch (node.type) {
    case "Symbol":
    case "StringLiteral":
    case "NumberLiteral":
    case "TypeParameter":
    case "Error":
    case "Intrinsic": {
      return [];
    }
    case "Union":
    case "Intersection": {
      return node.types.map((node, index) => {
        return { node, path: path.concat("types", index), depth };
      });
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return [{ node: node.value, path: path.concat("value"), depth }];
    }
    case "Tuple": {
      return node.value.map((node, index) => {
        return { node, path: path.concat("value", index), depth };
      });
    }
    case "IndexedAccess": {
      return [
        getPositionedNodeFromKey(node, "object"),
        getPositionedNodeFromKey(node, "index"),
      ];
    }
    case "Class": {
      return [
        ...(node.thisNode
          ? [{ node: node.thisNode, path: path.concat("thisNode"), depth }]
          : []),
        ...node.typeParameters.map((param, index) => {
          return {
            node: param,
            path: path.concat("typeParameters", index),
            depth,
          };
        }),
        ...node.properties.map((param, index) => {
          return {
            node: param.value,
            path: path.concat("properties", index, "value"),
            depth,
          };
        }),
      ];
    }
    case "Object": {
      return [
        ...flatMap(node.callSignatures, (signature, index) => {
          return [
            ...signature.typeParameters.map((x) => ({
              node: x,
              path: path.concat("callSignatures", "typeParameters", index),
              depth,
            })),
            ...signature.parameters.map((x) => ({
              node: x.type,
              path: path.concat("callSignatures", "parameters", index, "type"),
              depth,
            })),
            {
              node: signature.return,
              path: path.concat("callSignatures", "return"),
              depth,
            },
          ];
        }),
        ...flatMap(node.constructSignatures, (signature, index) => {
          return [
            ...signature.typeParameters.map((x) => ({
              node: x,
              path: path.concat("callSignatures", "typeParameters", index),
              depth,
            })),
            ...signature.parameters.map((x) => ({
              node: x.type,
              path: path.concat("callSignatures", "parameters", index, "type"),
              depth,
            })),
            {
              node: signature.return,
              path: path.concat("constructSignatures", "return"),
              depth,
            },
          ];
        }),
        ...node.aliasTypeArguments.map((node, index) => ({
          node,
          path: path.concat("aliasTypeArguments", index),
          depth,
        })),
        ...node.properties.map((param, index) => {
          return {
            node: param.value,
            path: path.concat("properties", index, "value"),
            depth,
          };
        }),
        ...(node.numberIndex
          ? [
              {
                node: node.numberIndex,
                depth,
                path: path.concat("numberIndex"),
              },
            ]
          : []),
        ...(node.stringIndex
          ? [
              {
                node: node.stringIndex,
                depth,
                path: path.concat("stringIndex"),
              },
            ]
          : []),
      ];
    }
    case "Conditional": {
      return [
        getPositionedNodeFromKey(node, "check"),
        getPositionedNodeFromKey(node, "true"),
        getPositionedNodeFromKey(node, "false"),
        getPositionedNodeFromKey(node, "extends"),
      ];
    }
    case "Lazy": {
      if (!node.value) {
        if (ignoreUnloadedLazyNodes) {
          return [];
        }
        throw new InternalError(
          "Lazy nodes should be loaded before being used in getChildPositionedMagicalNodes"
        );
      }
      return getChildPositionedMagicalNodes({
        node: node.value,
        path: path.concat("value"),
        depth: depth - 1,
      });
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new InternalError("this should never happen: " + node.type);
    }
  }
}

export function flatMap<T, U>(
  array: Array<T>,
  callback: (value: T, index: number) => U | ReadonlyArray<U>
): U[] {
  // @ts-ignore
  return array.reduce((acc, x, index) => {
    const r = callback(x, index);
    if (Array.isArray(r)) return [...acc, ...r];
    return [...acc, r];
  }, []);
}

export function getChildMagicalNodes(node: MagicalNode): Array<MagicalNode> {
  switch (node.type) {
    case "Symbol":
    case "StringLiteral":
    case "NumberLiteral":
    case "TypeParameter":
    case "Error":
    case "Intrinsic": {
      return [];
    }
    case "Union":
    case "Intersection": {
      return node.types;
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return [node.value];
    }
    case "Tuple": {
      return node.value;
    }
    case "IndexedAccess": {
      return [node.object, node.index];
    }
    case "Class": {
      return [
        ...(node.thisNode ? [node.thisNode] : []),
        ...node.typeParameters,
        ...node.properties.map((param) => {
          return param.value;
        }),
      ];
    }
    case "Object": {
      let childNodes = [
        ...flatMap(node.callSignatures, (signature) => {
          return [
            ...signature.typeParameters,
            ...signature.parameters.map((x) => x.type),
            signature.return,
          ];
        }),
        ...flatMap(node.constructSignatures, (signature) => {
          return [
            ...signature.typeParameters,
            ...signature.parameters.map((x) => x.type),
            signature.return,
          ];
        }),
        ...node.aliasTypeArguments,
        ...node.properties.map((param) => param.value),
      ];
      if (node.numberIndex) {
        childNodes.push(node.numberIndex);
      }
      if (node.stringIndex) {
        childNodes.push(node.stringIndex);
      }
      return childNodes;
    }
    case "Conditional": {
      return [node.check, node.true, node.false, node.extends];
    }
    case "Lazy": {
      throw new InternalError(
        "Lazy nodes should be loaded before being used in getChildPositionedMagicalNodes"
      );
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new InternalError("this should never happen: " + node.type);
    }
  }
}
