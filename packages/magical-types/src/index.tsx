import React from "react";
import { ComponentType } from "react";
import { MagicalNode } from "./types";

function Type({ node }: { node: MagicalNode }) {
  switch (node.type) {
    case "Any": {
      return <Type />;
    }
  }
}

export let PropTypes = (props: { component: ComponentType<any> }) => {
  console.log(props);
  let node: MagicalNode = (props as any).__types;
  return (
    <div>
      <Type node={node} />
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
};
