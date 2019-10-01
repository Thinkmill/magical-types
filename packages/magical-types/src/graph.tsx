import React, { useMemo, useState } from "react";
// @ts-ignore
import { Sigma, RelativeSize, RandomizeNodePositions } from "react-sigma";
import { MagicalNode } from "./types";
import { getChildPositionedMagicalNodes } from "./utils";
import { renderTypes } from ".";
// @ts-ignore
// import cytoscape from "cytoscape";
// @ts-ignore
// import avsdf from "cytoscape-avsdf";
// @ts-ignore
// import Cytoscape from "react-cytoscapejs";

// cytoscape.use(avsdf);

function getLabelForNode(node: MagicalNode): string {
  switch (node.type) {
    case "Intrinsic": {
      return node.value;
    }
    case "NumberLiteral": {
      return node.value + "";
    }
    case "StringLiteral": {
      return '"' + node.value + '"';
    }
    default: {
      // @ts-ignore
      if (node.name) {
        // @ts-ignore
        return node.name;
      }
      return node.type;
    }
  }
}

type GraphNode = {
  id: string;
  label: string;
  color?: string;
  node: MagicalNode;
};

type EdgeNode = {
  id: string;
  source: string;
  target: string;
  label: string;
  color?: string;
};

function createGraph(
  node: MagicalNode
): { nodes: Array<GraphNode>; edges: Array<EdgeNode> } {
  // because of circular references, we don't want to visit a node more than once
  let visitedNodes = new Map<MagicalNode, string>();

  let nodes: GraphNode[] = [];
  let edges: EdgeNode[] = [];

  let nodeIndex = 0;
  let edgeIndex = 0;

  function walkGraph(node: MagicalNode): string {
    if (visitedNodes.has(node)) {
      return visitedNodes.get(node)!;
    }
    let id = "n" + nodeIndex++;
    nodes.push({
      id,
      label: getLabelForNode(node),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      // @ts-ignore
      node
    });
    visitedNodes.set(node, id);

    let children = getChildPositionedMagicalNodes({ node, path: [] });

    for (let child of children) {
      edges.push({
        // @ts-ignore
        id: "e" + edgeIndex++,
        source: id,
        target: walkGraph(child.node),
        label: child.path.join(":"),
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        // @ts-ignore
        node: child.node
      });
    }

    return id;
  }
  walkGraph(node);
  return { nodes, edges };
}

// function createElements(node: MagicalNode): (GraphNode | EdgeNode)[] {
//   // because of circular references, we don't want to visit a node more than once
//   let visitedNodes = new Map<MagicalNode, string>();

//   let elements: (GraphNode | EdgeNode)[] = [];

//   let nodeIndex = 0;
//   let edgeIndex = 0;

//   function walkGraph(node: MagicalNode): string {
//     if (visitedNodes.has(node)) {
//       return visitedNodes.get(node)!;
//     }
//     let id = "n" + nodeIndex++;
//     elements.push({
//       id,
//       // @ts-ignore
//       label: node.name ? node.name : node.type,
//       color: "#" + Math.floor(Math.random() * 16777215).toString(16)
//     });
//     visitedNodes.set(node, id);

//     let children = getChildPositionedMagicalNodes({ node, path: [] });

//     for (let child of children) {
//       elements.push({
//         source: id,
//         target: walkGraph(child.node),
//         label: child.path.join(":"),
//         color: "#" + Math.floor(Math.random() * 16777215).toString(16)
//       });
//     }

//     return id;
//   }
//   walkGraph(node);
//   return elements;
// }

function Thing({ node }: { node: MagicalNode }) {
  return renderTypes(node);
}

export function Graph({ node }: { node: MagicalNode }) {
  let [currentNodeToDisplay, setCurrentNodeToDisplay] = useState<
    undefined | MagicalNode
  >();

  let graph = useMemo(
    () => (
      // <Cytoscape
      //   elements={createElements(node)}
      //   style={{ width: "600px", height: "600px" }}
      //   layout={{ name: "avsdf" }}
      // />
      <Sigma
        graph={createGraph(node)}
        onClickNode={(event: any) => {
          console.log(event.data.node.node);
          setCurrentNodeToDisplay(event.data.node.node);
        }}
        settings={{ drawEdges: true, clone: false }}
      >
        <RelativeSize initialSize={15} />
        <RandomizeNodePositions />
      </Sigma>
    ),
    [node]
  );
  return (
    <div>
      {graph}
      {currentNodeToDisplay && <Thing node={currentNodeToDisplay} />}
      {/* {currentNodeToDisplay && (
        <Graph key={Math.random()} node={currentNodeToDisplay} />
      )} */}
    </div>
  );
}
