import {
  ObjectNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex,
  MagicalNode,
  PositionedMagicalNode
} from "@magical-types/types";
import { serializeNodes, chunkNodes } from "./serialize";
import { deserialize } from "./deserialize";
import { getChildPositionedMagicalNodes } from "@magical-types/utils";

let tree: ObjectNode = {
  type: "Object",
  aliasTypeArguments: [],
  constructSignatures: [],
  name: "",
  callSignatures: [],
  properties: [
    {
      description: "",
      key: "something",
      required: true,
      value: {
        type: "Object",
        aliasTypeArguments: [],
        constructSignatures: [],
        name: "",
        callSignatures: [],
        properties: [
          {
            description: "",
            key: "something",
            required: true,
            value: {
              type: "Object",
              aliasTypeArguments: [],
              constructSignatures: [],
              name: "",
              callSignatures: [],
              properties: [
                {
                  description: "",
                  key: "something",
                  required: true,
                  value: {
                    type: "Object",
                    aliasTypeArguments: [],
                    constructSignatures: [],
                    name: "",
                    callSignatures: [],
                    properties: [
                      {
                        description: "",
                        key: "something",
                        required: true,
                        value: {
                          type: "Object",
                          aliasTypeArguments: [],
                          constructSignatures: [],
                          name: "",
                          callSignatures: [],
                          properties: [
                            {
                              description: "",
                              key: "something",
                              required: true,
                              value: {
                                type: "Object",
                                aliasTypeArguments: [],
                                constructSignatures: [],
                                name: "",
                                callSignatures: [],
                                properties: [
                                  {
                                    description: "",
                                    key: "something",
                                    required: true,
                                    value: {
                                      type: "Object",
                                      aliasTypeArguments: [],
                                      constructSignatures: [],
                                      name: "",
                                      callSignatures: [],
                                      properties: [
                                        {
                                          description: "",
                                          key: "something",
                                          required: true,
                                          value: {
                                            type: "Object",
                                            aliasTypeArguments: [],
                                            constructSignatures: [],
                                            name: "",
                                            callSignatures: [],
                                            properties: [
                                              {
                                                description: "",
                                                key: "something",
                                                required: true,
                                                value: {
                                                  type: "Object",
                                                  aliasTypeArguments: [],
                                                  constructSignatures: [],
                                                  name: "",
                                                  callSignatures: [],
                                                  properties: [
                                                    {
                                                      description: "",
                                                      key: "something",
                                                      required: true,
                                                      value: {
                                                        type: "Object",
                                                        aliasTypeArguments: [],
                                                        constructSignatures: [],
                                                        name: "",
                                                        callSignatures: [],
                                                        properties: [
                                                          {
                                                            description: "",
                                                            key: "something",
                                                            required: true,
                                                            value: {
                                                              type: "Object",
                                                              aliasTypeArguments: [],
                                                              constructSignatures: [],
                                                              name: "",
                                                              callSignatures: [],
                                                              properties: [
                                                                {
                                                                  description:
                                                                    "",
                                                                  key:
                                                                    "something",
                                                                  required: true,
                                                                  value: {
                                                                    type:
                                                                      "Object",
                                                                    aliasTypeArguments: [],
                                                                    constructSignatures: [],
                                                                    name: "",
                                                                    callSignatures: [],
                                                                    properties: [
                                                                      {
                                                                        description:
                                                                          "",
                                                                        key:
                                                                          "something",
                                                                        required: true,
                                                                        value: {
                                                                          type:
                                                                            "Object",
                                                                          aliasTypeArguments: [],
                                                                          constructSignatures: [],
                                                                          name:
                                                                            "",
                                                                          callSignatures: [],
                                                                          properties: [
                                                                            {
                                                                              description:
                                                                                "",
                                                                              key:
                                                                                "something",
                                                                              required: true,
                                                                              value: {
                                                                                type:
                                                                                  "Object",
                                                                                aliasTypeArguments: [],
                                                                                constructSignatures: [],
                                                                                name:
                                                                                  "",
                                                                                callSignatures: [],
                                                                                properties: [
                                                                                  {
                                                                                    description:
                                                                                      "",
                                                                                    key:
                                                                                      "something",
                                                                                    required: true,
                                                                                    value: {
                                                                                      type:
                                                                                        "Object",
                                                                                      aliasTypeArguments: [],
                                                                                      constructSignatures: [],
                                                                                      name:
                                                                                        "",
                                                                                      callSignatures: [],
                                                                                      properties: [
                                                                                        {
                                                                                          description:
                                                                                            "",
                                                                                          key:
                                                                                            "something",
                                                                                          required: true,
                                                                                          value: {
                                                                                            type:
                                                                                              "Object",
                                                                                            aliasTypeArguments: [],
                                                                                            constructSignatures: [],
                                                                                            name:
                                                                                              "",
                                                                                            callSignatures: [],
                                                                                            properties: [
                                                                                              {
                                                                                                description:
                                                                                                  "",
                                                                                                key:
                                                                                                  "something",
                                                                                                required: true,
                                                                                                value: {
                                                                                                  type:
                                                                                                    "Object",
                                                                                                  aliasTypeArguments: [],
                                                                                                  constructSignatures: [],
                                                                                                  name:
                                                                                                    "",
                                                                                                  callSignatures: [],
                                                                                                  properties: [
                                                                                                    {
                                                                                                      description:
                                                                                                        "",
                                                                                                      key:
                                                                                                        "something",
                                                                                                      required: true,
                                                                                                      value: {
                                                                                                        type:
                                                                                                          "Object",
                                                                                                        aliasTypeArguments: [],
                                                                                                        constructSignatures: [],
                                                                                                        name:
                                                                                                          "",
                                                                                                        callSignatures: [],
                                                                                                        properties: [
                                                                                                          {
                                                                                                            description:
                                                                                                              "",
                                                                                                            key:
                                                                                                              "something",
                                                                                                            required: true,
                                                                                                            value: {
                                                                                                              type:
                                                                                                                "Object",
                                                                                                              aliasTypeArguments: [],
                                                                                                              constructSignatures: [],
                                                                                                              name:
                                                                                                                "",
                                                                                                              callSignatures: [],
                                                                                                              properties: [
                                                                                                                {
                                                                                                                  description:
                                                                                                                    "",
                                                                                                                  key:
                                                                                                                    "something",
                                                                                                                  required: true,
                                                                                                                  value: {
                                                                                                                    type:
                                                                                                                      "Object",
                                                                                                                    aliasTypeArguments: [],
                                                                                                                    constructSignatures: [],
                                                                                                                    name:
                                                                                                                      "",
                                                                                                                    callSignatures: [],
                                                                                                                    properties: [
                                                                                                                      {
                                                                                                                        description:
                                                                                                                          "",
                                                                                                                        key:
                                                                                                                          "something",
                                                                                                                        required: true,
                                                                                                                        value: {
                                                                                                                          type:
                                                                                                                            "Object",
                                                                                                                          aliasTypeArguments: [],
                                                                                                                          constructSignatures: [],
                                                                                                                          name:
                                                                                                                            "",
                                                                                                                          callSignatures: [],
                                                                                                                          properties: [
                                                                                                                            {
                                                                                                                              description:
                                                                                                                                "",
                                                                                                                              key:
                                                                                                                                "something",
                                                                                                                              required: true,
                                                                                                                              value: {
                                                                                                                                type:
                                                                                                                                  "Object",
                                                                                                                                aliasTypeArguments: [],
                                                                                                                                constructSignatures: [],
                                                                                                                                name:
                                                                                                                                  "",
                                                                                                                                callSignatures: [],
                                                                                                                                properties: [
                                                                                                                                  {
                                                                                                                                    description:
                                                                                                                                      "",
                                                                                                                                    key:
                                                                                                                                      "something",
                                                                                                                                    required: true,
                                                                                                                                    value: {
                                                                                                                                      type:
                                                                                                                                        "Object",
                                                                                                                                      aliasTypeArguments: [],
                                                                                                                                      constructSignatures: [],
                                                                                                                                      name:
                                                                                                                                        "",
                                                                                                                                      callSignatures: [],
                                                                                                                                      properties: [
                                                                                                                                        {
                                                                                                                                          description:
                                                                                                                                            "",
                                                                                                                                          key:
                                                                                                                                            "something",
                                                                                                                                          required: true,
                                                                                                                                          value: {
                                                                                                                                            type:
                                                                                                                                              "Object",
                                                                                                                                            aliasTypeArguments: [],
                                                                                                                                            constructSignatures: [],
                                                                                                                                            name:
                                                                                                                                              "",
                                                                                                                                            callSignatures: [],
                                                                                                                                            properties: [
                                                                                                                                              {
                                                                                                                                                description:
                                                                                                                                                  "",
                                                                                                                                                key:
                                                                                                                                                  "something",
                                                                                                                                                required: true,
                                                                                                                                                value: {
                                                                                                                                                  type:
                                                                                                                                                    "Object",
                                                                                                                                                  aliasTypeArguments: [],
                                                                                                                                                  constructSignatures: [],
                                                                                                                                                  name:
                                                                                                                                                    "",
                                                                                                                                                  callSignatures: [],
                                                                                                                                                  properties: [
                                                                                                                                                    {
                                                                                                                                                      description:
                                                                                                                                                        "",
                                                                                                                                                      key:
                                                                                                                                                        "something",
                                                                                                                                                      required: true,
                                                                                                                                                      value: {
                                                                                                                                                        type:
                                                                                                                                                          "Object",
                                                                                                                                                        aliasTypeArguments: [],
                                                                                                                                                        constructSignatures: [],
                                                                                                                                                        name:
                                                                                                                                                          "",
                                                                                                                                                        callSignatures: [],
                                                                                                                                                        properties: [
                                                                                                                                                          {
                                                                                                                                                            description:
                                                                                                                                                              "",
                                                                                                                                                            key:
                                                                                                                                                              "something",
                                                                                                                                                            required: true,
                                                                                                                                                            value: {
                                                                                                                                                              type:
                                                                                                                                                                "Object",
                                                                                                                                                              aliasTypeArguments: [],
                                                                                                                                                              constructSignatures: [],
                                                                                                                                                              name:
                                                                                                                                                                "",
                                                                                                                                                              callSignatures: [],
                                                                                                                                                              properties: [
                                                                                                                                                                {
                                                                                                                                                                  description:
                                                                                                                                                                    "",
                                                                                                                                                                  key:
                                                                                                                                                                    "something",
                                                                                                                                                                  required: true,
                                                                                                                                                                  value: {
                                                                                                                                                                    type:
                                                                                                                                                                      "Intrinsic",
                                                                                                                                                                    value:
                                                                                                                                                                      "string"
                                                                                                                                                                  }
                                                                                                                                                                }
                                                                                                                                                              ]
                                                                                                                                                            }
                                                                                                                                                          }
                                                                                                                                                        ]
                                                                                                                                                      }
                                                                                                                                                    }
                                                                                                                                                  ]
                                                                                                                                                }
                                                                                                                                              }
                                                                                                                                            ]
                                                                                                                                          }
                                                                                                                                        }
                                                                                                                                      ]
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                ]
                                                                                                                              }
                                                                                                                            }
                                                                                                                          ]
                                                                                                                        }
                                                                                                                      }
                                                                                                                    ]
                                                                                                                  }
                                                                                                                }
                                                                                                              ]
                                                                                                            }
                                                                                                          }
                                                                                                        ]
                                                                                                      }
                                                                                                    }
                                                                                                  ]
                                                                                                }
                                                                                              }
                                                                                            ]
                                                                                          }
                                                                                        }
                                                                                      ]
                                                                                    }
                                                                                  }
                                                                                ]
                                                                              }
                                                                            }
                                                                          ]
                                                                        }
                                                                      }
                                                                    ]
                                                                  }
                                                                }
                                                              ]
                                                            }
                                                          }
                                                        ]
                                                      }
                                                    }
                                                  ]
                                                }
                                              }
                                            ]
                                          }
                                        }
                                      ]
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};

test("it works", async () => {
  const [below5, between5And10, above10] = chunkNodes(serializeNodes([tree]));
  let parsed = deserialize([
    below5,
    () => Promise.resolve(between5And10),
    () => Promise.resolve(above10)
  ])(0 as MagicalNodeIndex);
  await loadAllTheThings(parsed);
  expect(parsed).toMatchInlineSnapshot(`
    Object {
      "aliasTypeArguments": Array [],
      "callSignatures": Array [],
      "constructSignatures": Array [],
      "name": "",
      "numberIndex": undefined,
      "properties": Array [
        Object {
          "description": "",
          "key": "something",
          "required": true,
          "value": Object {
            "aliasTypeArguments": Array [],
            "callSignatures": Array [],
            "constructSignatures": Array [],
            "name": "",
            "numberIndex": undefined,
            "properties": Array [
              Object {
                "description": "",
                "key": "something",
                "required": true,
                "value": Object {
                  "aliasTypeArguments": Array [],
                  "callSignatures": Array [],
                  "constructSignatures": Array [],
                  "name": "",
                  "numberIndex": undefined,
                  "properties": Array [
                    Object {
                      "description": "",
                      "key": "something",
                      "required": true,
                      "value": Object {
                        "aliasTypeArguments": Array [],
                        "callSignatures": Array [],
                        "constructSignatures": Array [],
                        "name": "",
                        "numberIndex": undefined,
                        "properties": Array [
                          Object {
                            "description": "",
                            "key": "something",
                            "required": true,
                            "value": Object {
                              "aliasTypeArguments": Array [],
                              "callSignatures": Array [],
                              "constructSignatures": Array [],
                              "name": "",
                              "numberIndex": undefined,
                              "properties": Array [
                                Object {
                                  "description": "",
                                  "key": "something",
                                  "required": true,
                                  "value": Object {
                                    "loader": [Function],
                                    "type": "Lazy",
                                    "value": Object {
                                      "aliasTypeArguments": Array [],
                                      "callSignatures": Array [],
                                      "constructSignatures": Array [],
                                      "name": "",
                                      "numberIndex": undefined,
                                      "properties": Array [
                                        Object {
                                          "description": "",
                                          "key": "something",
                                          "required": true,
                                          "value": Object {
                                            "loader": [Function],
                                            "type": "Lazy",
                                            "value": Object {
                                              "aliasTypeArguments": Array [],
                                              "callSignatures": Array [],
                                              "constructSignatures": Array [],
                                              "name": "",
                                              "numberIndex": undefined,
                                              "properties": Array [
                                                Object {
                                                  "description": "",
                                                  "key": "something",
                                                  "required": true,
                                                  "value": Object {
                                                    "loader": [Function],
                                                    "type": "Lazy",
                                                    "value": Object {
                                                      "aliasTypeArguments": Array [],
                                                      "callSignatures": Array [],
                                                      "constructSignatures": Array [],
                                                      "name": "",
                                                      "numberIndex": undefined,
                                                      "properties": Array [
                                                        Object {
                                                          "description": "",
                                                          "key": "something",
                                                          "required": true,
                                                          "value": Object {
                                                            "loader": [Function],
                                                            "type": "Lazy",
                                                            "value": Object {
                                                              "aliasTypeArguments": Array [],
                                                              "callSignatures": Array [],
                                                              "constructSignatures": Array [],
                                                              "name": "",
                                                              "numberIndex": undefined,
                                                              "properties": Array [
                                                                Object {
                                                                  "description": "",
                                                                  "key": "something",
                                                                  "required": true,
                                                                  "value": Object {
                                                                    "loader": [Function],
                                                                    "type": "Lazy",
                                                                    "value": Object {
                                                                      "aliasTypeArguments": Array [],
                                                                      "callSignatures": Array [],
                                                                      "constructSignatures": Array [],
                                                                      "name": "",
                                                                      "numberIndex": undefined,
                                                                      "properties": Array [
                                                                        Object {
                                                                          "description": "",
                                                                          "key": "something",
                                                                          "required": true,
                                                                          "value": Object {
                                                                            "loader": [Function],
                                                                            "type": "Lazy",
                                                                            "value": Object {
                                                                              "aliasTypeArguments": Array [],
                                                                              "callSignatures": Array [],
                                                                              "constructSignatures": Array [],
                                                                              "name": "",
                                                                              "numberIndex": undefined,
                                                                              "properties": Array [
                                                                                Object {
                                                                                  "description": "",
                                                                                  "key": "something",
                                                                                  "required": true,
                                                                                  "value": Object {
                                                                                    "loader": [Function],
                                                                                    "type": "Lazy",
                                                                                    "value": Object {
                                                                                      "aliasTypeArguments": Array [],
                                                                                      "callSignatures": Array [],
                                                                                      "constructSignatures": Array [],
                                                                                      "name": "",
                                                                                      "numberIndex": undefined,
                                                                                      "properties": Array [
                                                                                        Object {
                                                                                          "description": "",
                                                                                          "key": "something",
                                                                                          "required": true,
                                                                                          "value": Object {
                                                                                            "loader": [Function],
                                                                                            "type": "Lazy",
                                                                                            "value": Object {
                                                                                              "aliasTypeArguments": Array [],
                                                                                              "callSignatures": Array [],
                                                                                              "constructSignatures": Array [],
                                                                                              "name": "",
                                                                                              "numberIndex": undefined,
                                                                                              "properties": Array [
                                                                                                Object {
                                                                                                  "description": "",
                                                                                                  "key": "something",
                                                                                                  "required": true,
                                                                                                  "value": Object {
                                                                                                    "loader": [Function],
                                                                                                    "type": "Lazy",
                                                                                                    "value": Object {
                                                                                                      "aliasTypeArguments": Array [],
                                                                                                      "callSignatures": Array [],
                                                                                                      "constructSignatures": Array [],
                                                                                                      "name": "",
                                                                                                      "numberIndex": undefined,
                                                                                                      "properties": Array [
                                                                                                        Object {
                                                                                                          "description": "",
                                                                                                          "key": "something",
                                                                                                          "required": true,
                                                                                                          "value": Object {
                                                                                                            "loader": [Function],
                                                                                                            "type": "Lazy",
                                                                                                            "value": Object {
                                                                                                              "aliasTypeArguments": Array [],
                                                                                                              "callSignatures": Array [],
                                                                                                              "constructSignatures": Array [],
                                                                                                              "name": "",
                                                                                                              "numberIndex": undefined,
                                                                                                              "properties": Array [
                                                                                                                Object {
                                                                                                                  "description": "",
                                                                                                                  "key": "something",
                                                                                                                  "required": true,
                                                                                                                  "value": Object {
                                                                                                                    "loader": [Function],
                                                                                                                    "type": "Lazy",
                                                                                                                    "value": Object {
                                                                                                                      "aliasTypeArguments": Array [],
                                                                                                                      "callSignatures": Array [],
                                                                                                                      "constructSignatures": Array [],
                                                                                                                      "name": "",
                                                                                                                      "numberIndex": undefined,
                                                                                                                      "properties": Array [
                                                                                                                        Object {
                                                                                                                          "description": "",
                                                                                                                          "key": "something",
                                                                                                                          "required": true,
                                                                                                                          "value": Object {
                                                                                                                            "loader": [Function],
                                                                                                                            "type": "Lazy",
                                                                                                                            "value": Object {
                                                                                                                              "aliasTypeArguments": Array [],
                                                                                                                              "callSignatures": Array [],
                                                                                                                              "constructSignatures": Array [],
                                                                                                                              "name": "",
                                                                                                                              "numberIndex": undefined,
                                                                                                                              "properties": Array [
                                                                                                                                Object {
                                                                                                                                  "description": "",
                                                                                                                                  "key": "something",
                                                                                                                                  "required": true,
                                                                                                                                  "value": Object {
                                                                                                                                    "loader": [Function],
                                                                                                                                    "type": "Lazy",
                                                                                                                                    "value": Object {
                                                                                                                                      "aliasTypeArguments": Array [],
                                                                                                                                      "callSignatures": Array [],
                                                                                                                                      "constructSignatures": Array [],
                                                                                                                                      "name": "",
                                                                                                                                      "numberIndex": undefined,
                                                                                                                                      "properties": Array [
                                                                                                                                        Object {
                                                                                                                                          "description": "",
                                                                                                                                          "key": "something",
                                                                                                                                          "required": true,
                                                                                                                                          "value": Object {
                                                                                                                                            "loader": [Function],
                                                                                                                                            "type": "Lazy",
                                                                                                                                            "value": Object {
                                                                                                                                              "aliasTypeArguments": Array [],
                                                                                                                                              "callSignatures": Array [],
                                                                                                                                              "constructSignatures": Array [],
                                                                                                                                              "name": "",
                                                                                                                                              "numberIndex": undefined,
                                                                                                                                              "properties": Array [
                                                                                                                                                Object {
                                                                                                                                                  "description": "",
                                                                                                                                                  "key": "something",
                                                                                                                                                  "required": true,
                                                                                                                                                  "value": Object {
                                                                                                                                                    "loader": [Function],
                                                                                                                                                    "type": "Lazy",
                                                                                                                                                    "value": Object {
                                                                                                                                                      "aliasTypeArguments": Array [],
                                                                                                                                                      "callSignatures": Array [],
                                                                                                                                                      "constructSignatures": Array [],
                                                                                                                                                      "name": "",
                                                                                                                                                      "numberIndex": undefined,
                                                                                                                                                      "properties": Array [
                                                                                                                                                        Object {
                                                                                                                                                          "description": "",
                                                                                                                                                          "key": "something",
                                                                                                                                                          "required": true,
                                                                                                                                                          "value": Object {
                                                                                                                                                            "loader": [Function],
                                                                                                                                                            "type": "Lazy",
                                                                                                                                                            "value": Object {
                                                                                                                                                              "aliasTypeArguments": Array [],
                                                                                                                                                              "callSignatures": Array [],
                                                                                                                                                              "constructSignatures": Array [],
                                                                                                                                                              "name": "",
                                                                                                                                                              "numberIndex": undefined,
                                                                                                                                                              "properties": Array [
                                                                                                                                                                Object {
                                                                                                                                                                  "description": "",
                                                                                                                                                                  "key": "something",
                                                                                                                                                                  "required": true,
                                                                                                                                                                  "value": Object {
                                                                                                                                                                    "loader": [Function],
                                                                                                                                                                    "type": "Lazy",
                                                                                                                                                                    "value": Object {
                                                                                                                                                                      "aliasTypeArguments": Array [],
                                                                                                                                                                      "callSignatures": Array [],
                                                                                                                                                                      "constructSignatures": Array [],
                                                                                                                                                                      "name": "",
                                                                                                                                                                      "numberIndex": undefined,
                                                                                                                                                                      "properties": Array [
                                                                                                                                                                        Object {
                                                                                                                                                                          "description": "",
                                                                                                                                                                          "key": "something",
                                                                                                                                                                          "required": true,
                                                                                                                                                                          "value": Object {
                                                                                                                                                                            "loader": [Function],
                                                                                                                                                                            "type": "Lazy",
                                                                                                                                                                            "value": Object {
                                                                                                                                                                              "aliasTypeArguments": Array [],
                                                                                                                                                                              "callSignatures": Array [],
                                                                                                                                                                              "constructSignatures": Array [],
                                                                                                                                                                              "name": "",
                                                                                                                                                                              "numberIndex": undefined,
                                                                                                                                                                              "properties": Array [
                                                                                                                                                                                Object {
                                                                                                                                                                                  "description": "",
                                                                                                                                                                                  "key": "something",
                                                                                                                                                                                  "required": true,
                                                                                                                                                                                  "value": Object {
                                                                                                                                                                                    "loader": [Function],
                                                                                                                                                                                    "type": "Lazy",
                                                                                                                                                                                    "value": Object {
                                                                                                                                                                                      "aliasTypeArguments": Array [],
                                                                                                                                                                                      "callSignatures": Array [],
                                                                                                                                                                                      "constructSignatures": Array [],
                                                                                                                                                                                      "name": "",
                                                                                                                                                                                      "numberIndex": undefined,
                                                                                                                                                                                      "properties": Array [
                                                                                                                                                                                        Object {
                                                                                                                                                                                          "description": "",
                                                                                                                                                                                          "key": "something",
                                                                                                                                                                                          "required": true,
                                                                                                                                                                                          "value": Object {
                                                                                                                                                                                            "loader": [Function],
                                                                                                                                                                                            "type": "Lazy",
                                                                                                                                                                                            "value": Object {
                                                                                                                                                                                              "aliasTypeArguments": Array [],
                                                                                                                                                                                              "callSignatures": Array [],
                                                                                                                                                                                              "constructSignatures": Array [],
                                                                                                                                                                                              "name": "",
                                                                                                                                                                                              "numberIndex": undefined,
                                                                                                                                                                                              "properties": Array [
                                                                                                                                                                                                Object {
                                                                                                                                                                                                  "description": "",
                                                                                                                                                                                                  "key": "something",
                                                                                                                                                                                                  "required": true,
                                                                                                                                                                                                  "value": Object {
                                                                                                                                                                                                    "loader": [Function],
                                                                                                                                                                                                    "type": "Lazy",
                                                                                                                                                                                                    "value": Object {
                                                                                                                                                                                                      "aliasTypeArguments": Array [],
                                                                                                                                                                                                      "callSignatures": Array [],
                                                                                                                                                                                                      "constructSignatures": Array [],
                                                                                                                                                                                                      "name": "",
                                                                                                                                                                                                      "numberIndex": undefined,
                                                                                                                                                                                                      "properties": Array [
                                                                                                                                                                                                        Object {
                                                                                                                                                                                                          "description": "",
                                                                                                                                                                                                          "key": "something",
                                                                                                                                                                                                          "required": true,
                                                                                                                                                                                                          "value": Object {
                                                                                                                                                                                                            "loader": [Function],
                                                                                                                                                                                                            "type": "Lazy",
                                                                                                                                                                                                            "value": Object {
                                                                                                                                                                                                              "aliasTypeArguments": Array [],
                                                                                                                                                                                                              "callSignatures": Array [],
                                                                                                                                                                                                              "constructSignatures": Array [],
                                                                                                                                                                                                              "name": "",
                                                                                                                                                                                                              "numberIndex": undefined,
                                                                                                                                                                                                              "properties": Array [
                                                                                                                                                                                                                Object {
                                                                                                                                                                                                                  "description": "",
                                                                                                                                                                                                                  "key": "something",
                                                                                                                                                                                                                  "required": true,
                                                                                                                                                                                                                  "value": Object {
                                                                                                                                                                                                                    "loader": [Function],
                                                                                                                                                                                                                    "type": "Lazy",
                                                                                                                                                                                                                    "value": Object {
                                                                                                                                                                                                                      "type": "Intrinsic",
                                                                                                                                                                                                                      "value": "string",
                                                                                                                                                                                                                    },
                                                                                                                                                                                                                  },
                                                                                                                                                                                                                },
                                                                                                                                                                                                              ],
                                                                                                                                                                                                              "stringIndex": undefined,
                                                                                                                                                                                                              "type": "Object",
                                                                                                                                                                                                            },
                                                                                                                                                                                                          },
                                                                                                                                                                                                        },
                                                                                                                                                                                                      ],
                                                                                                                                                                                                      "stringIndex": undefined,
                                                                                                                                                                                                      "type": "Object",
                                                                                                                                                                                                    },
                                                                                                                                                                                                  },
                                                                                                                                                                                                },
                                                                                                                                                                                              ],
                                                                                                                                                                                              "stringIndex": undefined,
                                                                                                                                                                                              "type": "Object",
                                                                                                                                                                                            },
                                                                                                                                                                                          },
                                                                                                                                                                                        },
                                                                                                                                                                                      ],
                                                                                                                                                                                      "stringIndex": undefined,
                                                                                                                                                                                      "type": "Object",
                                                                                                                                                                                    },
                                                                                                                                                                                  },
                                                                                                                                                                                },
                                                                                                                                                                              ],
                                                                                                                                                                              "stringIndex": undefined,
                                                                                                                                                                              "type": "Object",
                                                                                                                                                                            },
                                                                                                                                                                          },
                                                                                                                                                                        },
                                                                                                                                                                      ],
                                                                                                                                                                      "stringIndex": undefined,
                                                                                                                                                                      "type": "Object",
                                                                                                                                                                    },
                                                                                                                                                                  },
                                                                                                                                                                },
                                                                                                                                                              ],
                                                                                                                                                              "stringIndex": undefined,
                                                                                                                                                              "type": "Object",
                                                                                                                                                            },
                                                                                                                                                          },
                                                                                                                                                        },
                                                                                                                                                      ],
                                                                                                                                                      "stringIndex": undefined,
                                                                                                                                                      "type": "Object",
                                                                                                                                                    },
                                                                                                                                                  },
                                                                                                                                                },
                                                                                                                                              ],
                                                                                                                                              "stringIndex": undefined,
                                                                                                                                              "type": "Object",
                                                                                                                                            },
                                                                                                                                          },
                                                                                                                                        },
                                                                                                                                      ],
                                                                                                                                      "stringIndex": undefined,
                                                                                                                                      "type": "Object",
                                                                                                                                    },
                                                                                                                                  },
                                                                                                                                },
                                                                                                                              ],
                                                                                                                              "stringIndex": undefined,
                                                                                                                              "type": "Object",
                                                                                                                            },
                                                                                                                          },
                                                                                                                        },
                                                                                                                      ],
                                                                                                                      "stringIndex": undefined,
                                                                                                                      "type": "Object",
                                                                                                                    },
                                                                                                                  },
                                                                                                                },
                                                                                                              ],
                                                                                                              "stringIndex": undefined,
                                                                                                              "type": "Object",
                                                                                                            },
                                                                                                          },
                                                                                                        },
                                                                                                      ],
                                                                                                      "stringIndex": undefined,
                                                                                                      "type": "Object",
                                                                                                    },
                                                                                                  },
                                                                                                },
                                                                                              ],
                                                                                              "stringIndex": undefined,
                                                                                              "type": "Object",
                                                                                            },
                                                                                          },
                                                                                        },
                                                                                      ],
                                                                                      "stringIndex": undefined,
                                                                                      "type": "Object",
                                                                                    },
                                                                                  },
                                                                                },
                                                                              ],
                                                                              "stringIndex": undefined,
                                                                              "type": "Object",
                                                                            },
                                                                          },
                                                                        },
                                                                      ],
                                                                      "stringIndex": undefined,
                                                                      "type": "Object",
                                                                    },
                                                                  },
                                                                },
                                                              ],
                                                              "stringIndex": undefined,
                                                              "type": "Object",
                                                            },
                                                          },
                                                        },
                                                      ],
                                                      "stringIndex": undefined,
                                                      "type": "Object",
                                                    },
                                                  },
                                                },
                                              ],
                                              "stringIndex": undefined,
                                              "type": "Object",
                                            },
                                          },
                                        },
                                      ],
                                      "stringIndex": undefined,
                                      "type": "Object",
                                    },
                                  },
                                },
                              ],
                              "stringIndex": undefined,
                              "type": "Object",
                            },
                          },
                        ],
                        "stringIndex": undefined,
                        "type": "Object",
                      },
                    },
                  ],
                  "stringIndex": undefined,
                  "type": "Object",
                },
              },
            ],
            "stringIndex": undefined,
            "type": "Object",
          },
        },
      ],
      "stringIndex": undefined,
      "type": "Object",
    }
  `);
});

async function loadAllTheThings(rootNode: MagicalNode) {
  let pathsThatShouldBeExpandedByDefault = new Set<string>();

  // because of circular references, we don't want to visit a node more than once
  let visitedNodes = new Set<MagicalNode>();

  let queue: Array<PositionedMagicalNode> = [
    { node: rootNode, path: [], depth: 0 }
  ];

  while (queue.length) {
    let currentPositionedNode = queue.shift()!;

    visitedNodes.add(currentPositionedNode.node);
    if (currentPositionedNode.node.type === "Lazy") {
      await currentPositionedNode.node.loader();
    }

    let childPositionedNodes = getChildPositionedMagicalNodes(
      currentPositionedNode
    ).filter(({ node }) => !visitedNodes.has(node));
    queue.push(...childPositionedNodes);
  }
  return pathsThatShouldBeExpandedByDefault;
}
