export type MagicalNode =
  | { type: "Any" }
  | { type: "Undefined" }
  | { type: "Boolean" }
  | { type: "BooleanLiteral"; value: boolean }
  | { type: "Number" }
  | { type: "String" }
  | { type: "Void" }
  | { type: "VoidLike" }
  | { type: "StringLiteral"; value: string }
  | { type: "NumberLiteral"; value: number }
  | { type: "Union"; types: Array<MagicalNode> }
  | { type: "Intersection"; types: Array<MagicalNode> }
  | { type: "Function"; signatures: Array<Signature> }
  | {
      type: "Object";
      name: string | null;
      properties: Array<Property>;
    };

type Property = { key: string; value: MagicalNode };

type Signature = {
  return: MagicalNode;
  parameters: Array<Parameter>;
};

type Parameter = {
  name: string;
  type: MagicalNode;
};
