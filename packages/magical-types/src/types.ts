import { typeParameter } from "@babel/types";

export type ObjectNode = {
  type: "Object";
  name: string | null;
  properties: Array<Property>;
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
  | { type: "StringLiteral"; value: string }
  | { type: "NumberLiteral"; value: number }
  | { type: "Array"; value: MagicalNode }
  | { type: "ReadonlyArray"; value: MagicalNode }
  | { type: "Union"; types: Array<MagicalNode>; name: string | null }
  | { type: "Intersection"; types: Array<MagicalNode> }
  | {
      type: "Function";
      return: MagicalNode;
      parameters: Array<Parameter>;
      typeParameters: Array<TypeParameterNode>;
    }
  | TypeParameterNode
  | { type: "Tuple"; value: Array<MagicalNode> }
  | ClassNode
  | ObjectNode;

export type Property = { key: string; value: MagicalNode };

type Parameter = {
  name: string;
  type: MagicalNode;
  required: boolean;
};
