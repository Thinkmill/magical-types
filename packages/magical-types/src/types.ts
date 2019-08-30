import { typeParameter } from "@babel/types";

export type SignatureNode = {
  return: MagicalNode;
  parameters: Array<Parameter>;
  typeParameters: Array<TypeParameterNode>;
};

type IndexedAccessNode = {
  type: "IndexedAccess";
  object: MagicalNode;
  index: MagicalNode;
};

export type ObjectNode = {
  type: "Object";
  name: string | null;
  properties: Array<Property>;
  callSignatures: Array<SignatureNode>;
  constructSignatures: Array<SignatureNode>;
  aliasTypeArguments: Array<MagicalNode>;
};

export type ClassNode = {
  type: "Class";
  name: string | null;
  typeParameters: Array<MagicalNode>;
  thisNode: MagicalNode | null;
  properties: Array<Property>;
};

export type TypeParameterNode = { type: "TypeParameter"; value: string };

export type MagicalNode =
  | { type: "Intrinsic"; value: string }
  | { type: "Promise"; value: MagicalNode }
  | { type: "StringLiteral"; value: string }
  | { type: "NumberLiteral"; value: number }
  | { type: "Array"; value: MagicalNode }
  | { type: "ReadonlyArray"; value: MagicalNode }
  | { type: "Union"; types: Array<MagicalNode>; name: string | null }
  | { type: "Intersection"; types: Array<MagicalNode> }
  | {
      type: "Conditional";
      true: MagicalNode;
      false: MagicalNode;
      check: MagicalNode;
      extends: MagicalNode;
    }
  | TypeParameterNode
  | IndexedAccessNode
  | { type: "Tuple"; value: Array<MagicalNode> }
  | ClassNode
  | ObjectNode;

export type MagicalNodeHash = string & { __magicalNodeHash: any };

type InnerReplace<Thing> = Thing extends MagicalNode
  ? MagicalNodeHash
  : Thing extends object
  ? ReplaceMagicalNode<Thing>
  : Thing;

type ReplaceMagicalNode<Thing> = {
  [Key in keyof Thing]: Thing[Key] extends Array<infer Element>
    ? Array<InnerReplace<Element>>
    : InnerReplace<Thing[Key]>;
};

export type HashedMagicalNode = ReplaceMagicalNode<MagicalNode>;

export type PositionedMagicalNode = {
  path: Array<string | number>;
  node: MagicalNode;
};

export type Property = {
  key: string;
  description: string;
  value: MagicalNode;
  required: boolean;
};

export type Parameter = {
  name: string;
  type: MagicalNode;
  required: boolean;
};
