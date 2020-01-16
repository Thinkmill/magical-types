import React from "react";
import { render } from "@testing-library/react";
import { Types } from "@magical-types/pretty";
import { ObjectNode } from "@magical-types/types";

let nodeWithCircularParam: ObjectNode = {
  type: "Object",
  aliasTypeArguments: [],
  callSignatures: [
    {
      parameters: [
        {
          name: "thing",
          required: true,
          type: { type: "Intrinsic", value: "string" }
        }
      ],
      return: { type: "Intrinsic", value: "string" },
      typeParameters: []
    }
  ],
  constructSignatures: [],
  name: "",
  properties: []
};

nodeWithCircularParam.callSignatures[0].parameters[0].type = nodeWithCircularParam;

let nodeWithCircularReturn: ObjectNode = {
  type: "Object",
  aliasTypeArguments: [],
  callSignatures: [
    {
      parameters: [
        {
          name: "thing",
          required: true,
          type: { type: "Intrinsic", value: "string" }
        }
      ],
      return: { type: "Intrinsic", value: "string" },
      typeParameters: []
    }
  ],
  constructSignatures: [],
  name: "",
  properties: []
};

nodeWithCircularReturn.callSignatures[0].return = nodeWithCircularReturn;

test("function with circular param", () => {
  let { container } = render(<Types node={nodeWithCircularParam} />);
  expect(container).toMatchSnapshot();
});

test("function with circular return", () => {
  let { container } = render(<Types node={nodeWithCircularReturn} />);
  expect(container).toMatchSnapshot();
});
