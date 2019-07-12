export type ObjectNode = {
  type: "Object";
  name: string | null;
  properties: Array<Property>;
};

export type MagicalNode =
  | { type: "Intrinsic"; value: string }
  | { type: "StringLiteral"; value: string }
  | { type: "NumberLiteral"; value: number }
  | { type: "Union"; types: Array<MagicalNode> }
  | { type: "Intersection"; types: Array<MagicalNode> }
  | { type: "Function"; return: MagicalNode; parameters: Array<Parameter> }
  | ObjectNode;

type Property = { key: string; value: MagicalNode };

type Parameter = {
  name: string;
  type: MagicalNode;
};
