import {
  ObjectNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex,
  MagicalNode,
  PositionedMagicalNode
} from "@magical-types/types";
import { serializeNodes } from "./serialize";
import { parseStringified } from "../runtime/src/parse";
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
  let { nodes, nodesToIndex } = serializeNodes([tree]);

  let below5: MagicalNodeWithIndexes[] = [];
  let between5And10: MagicalNodeWithIndexes[] = [];
  let above10: MagicalNodeWithIndexes[] = [];

  for (let [, { depth, index }] of nodesToIndex) {
    if (depth < 5) {
      below5.push(nodes[index]);
    } else if (depth <= 10) {
      between5And10.push(nodes[index]);
    } else {
      above10.push(nodes[index]);
    }
  }
  let parsed = parseStringified([
    below5,
    () => Promise.resolve({ default: between5And10 }),
    () => Promise.resolve({ default: above10 })
  ])(0 as MagicalNodeIndex);
  await loadAllTheThings(parsed);
  expect(parsed).toMatchInlineSnapshot(`
    Object {
      "aliasTypeArguments": Array [],
      "callSignatures": Array [],
      "constructSignatures": Array [],
      "name": "",
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
                              "properties": Array [
                                Object {
                                  "description": "",
                                  "key": "something",
                                  "required": true,
                                  "value": Object {
                                    "loader": [Function],
                                    "type": "Lazy",
                                  },
                                },
                              ],
                              "type": "Object",
                            },
                          },
                        ],
                        "type": "Object",
                      },
                    },
                  ],
                  "type": "Object",
                },
              },
            ],
            "type": "Object",
          },
        },
      ],
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

    // we don't want to open any nodes deeper than 5 nodes by default
    let childPositionedNodes = getChildPositionedMagicalNodes(
      currentPositionedNode
    ).filter(({ node }) => !visitedNodes.has(node));
    queue.push(...childPositionedNodes);
  }
  return pathsThatShouldBeExpandedByDefault;
}
