import { getNode } from "@magical-types/macro";
import { memo } from "react";

test("it works", () => {
  type Thing = { color: "green" };
  expect(getNode<Thing>()).toMatchInlineSnapshot(`
    Object {
      "aliasTypeArguments": Array [],
      "callSignatures": Array [],
      "constructSignatures": Array [],
      "name": "Thing",
      "properties": Array [
        Object {
          "description": "",
          "key": "color",
          "required": true,
          "value": Object {
            "type": "StringLiteral",
            "value": "green",
          },
        },
      ],
      "type": "Object",
    }
  `);
});

// test.only("React.memo", () => {
//   expect(getNode<typeof memo>()).toMatchInlineSnapshot(`
//   Object {
//     "aliasTypeArguments": Array [],
//     "callSignatures": Array [],
//     "constructSignatures": Array [],
//     "name": "Thing",
//     "properties": Array [
//       Object {
//         "description": "",
//         "key": "color",
//         "required": true,
//         "value": Object {
//           "type": "StringLiteral",
//           "value": "green",
//         },
//       },
//     ],
//     "type": "Object",
//   }
// `);
// });
