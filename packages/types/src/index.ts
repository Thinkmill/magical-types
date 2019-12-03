export type SignatureNode = {
  return: MagicalNode;
  parameters: Array<Parameter>;
  typeParameters: Array<MagicalNodes["TypeParameter"]>;
};

export type MagicalNodes = {
  Intrinsic: { type: "Intrinsic"; value: string };
  Promise: { type: "Promise"; value: MagicalNode };
  StringLiteral: { type: "StringLiteral"; value: string };
  NumberLiteral: { type: "NumberLiteral"; value: number };
  Array: { type: "Array"; value: MagicalNode };
  ReadOnlyArray: { type: "ReadonlyArray"; value: MagicalNode };
  Union: { type: "Union"; types: Array<MagicalNode>; name: string | null };
  Intersection: { type: "Intersection"; types: Array<MagicalNode> };
  Symbol: { type: "Symbol"; name: string };
  Conditional: {
    type: "Conditional";
    true: MagicalNode;
    false: MagicalNode;
    check: MagicalNode;
    extends: MagicalNode;
  };
  TypeParameter: { type: "TypeParameter"; value: string };
  IndexedAccess: {
    type: "IndexedAccess";
    object: MagicalNode;
    index: MagicalNode;
  };
  Tuple: { type: "Tuple"; value: Array<MagicalNode> };
  Class: {
    type: "Class";
    name: string | null;
    typeParameters: Array<MagicalNode>;
    thisNode: MagicalNode | null;
    properties: Array<Property>;
  };
  Object: {
    type: "Object";
    name: string | null;
    properties: Array<Property>;
    callSignatures: Array<SignatureNode>;
    constructSignatures: Array<SignatureNode>;
    aliasTypeArguments: Array<MagicalNode>;
  };
};

export type MagicalNode = MagicalNodes[keyof MagicalNodes];

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
