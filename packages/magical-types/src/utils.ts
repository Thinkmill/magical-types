import { PositionedMagicalNode } from "./types";

export function getChildPositionedMagicalNodes({
  node,
  path
}: PositionedMagicalNode): Array<PositionedMagicalNode> {
  function getPositionedNodeFromKey<Obj, Key extends keyof Obj>(
    obj: Obj,
    key: Key
  ): {
    node: Obj[Key];
    path: Array<string | number>;
  } {
    return { node: obj[key], path: path.concat(key as string | number) };
  }
  switch (node.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "TypeParameter":
    case "Intrinsic": {
      return [];
    }
    case "Union":
    case "Intersection": {
      return node.types.map((node, index) => {
        return { node, path: path.concat("types", index) };
      });
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return [{ node: node.value, path: path.concat("value") }];
    }
    case "Tuple": {
      return node.value.map((node, index) => {
        return { node, path: path.concat("value", index) };
      });
    }
    case "IndexedAccess": {
      return [
        { node: node.object, path: path.concat("object") },
        { node: node.index, path: path.concat("index") }
      ];
    }
    case "Class": {
      return [
        ...node.properties.map((param, index) => {
          return {
            node: param.value,
            path: path.concat("properties", index, "value")
          };
        })
      ];
    }
    case "Object": {
      return [
        ...node.callSignatures.flatMap((signature, index) => {
          return [
            ...signature.typeParameters.map(x => ({
              node: x,
              path: path.concat("callSignatures", "typeParameters", index)
            })),
            ...signature.parameters.map(x => ({
              node: x.type,
              path: path.concat("callSignatures", "parameters", index, "type")
            })),
            {
              node: signature.return,
              path: path.concat("callSignatures", "return")
            }
          ];
        }),
        ...node.constructSignatures.flatMap((signature, index) => {
          return [
            ...signature.typeParameters.map(x => ({
              node: x,
              path: path.concat("callSignatures", "typeParameters", index)
            })),
            ...signature.parameters.map(x => ({
              node: x.type,
              path: path.concat("callSignatures", "parameters", index, "type")
            })),
            {
              node: signature.return,
              path: path.concat("constructSignatures", "return")
            }
          ];
        }),
        ...node.aliasTypeArguments.map((node, index) => ({
          node,
          path: path.concat("aliasTypeArguments", index)
        })),
        ...node.properties.map((param, index) => {
          return {
            node: param.value,
            path: path.concat("properties", index, "value")
          };
        })
      ];
    }
    case "Conditional": {
      return [
        getPositionedNodeFromKey(node, "check"),
        getPositionedNodeFromKey(node, "true"),
        getPositionedNodeFromKey(node, "false"),
        getPositionedNodeFromKey(node, "extends")
      ];
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new Error("this should never happen: " + node.type);
    }
  }
}
