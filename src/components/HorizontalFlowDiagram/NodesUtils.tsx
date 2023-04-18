import { Node, Edge } from "react-flow-renderer";

interface FlowNode extends Node {
  position: { x: number; y: number };
  parentNode?: string;
}

interface FlowEdge extends Edge {}

const COLUMN_WIDTH = 200;
const ROW_HEIGHT = 100;
const COLUMN_MARGIN = 25;
const ROW_MARGIN = 20;

export function setFlowNodePositions(nodes: FlowNode[], edges: FlowEdge[], x: number, y: number) {
  let visited = new Set<FlowNode>();

  function setFlowNodePosition(node: FlowNode, x: number, y: number) {
    if (visited.has(node)) return;

    visited.add(node);

    const targets = edges
      .filter((e) => e.source === node.id)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter((n): n is FlowNode => n !== undefined && !visited.has(n));

    // Recursively set the position of each target
    targets.forEach((tgt, i) => {
      const tgtX = x + COLUMN_WIDTH + COLUMN_MARGIN;
      const tgtY = ROW_HEIGHT * i + ROW_MARGIN * (i + 1);
      setFlowNodePosition(tgt, tgtX, tgtY);
    });

    // Set the position of the current node
    node.position.x = x;
    node.position.y = y;
  }

  // Start by setting the positions of nodes without sources
  const roots = nodes.filter((n) => !edges.some((e) => e.target === n.id));
  roots.forEach((root, i) => {
    const rootX = x + COLUMN_WIDTH / 2;
    const rootY = y + ROW_HEIGHT * i + ROW_MARGIN * (i + 1);
    setFlowNodePosition(root, rootX, rootY);
  });
}

interface GroupNode extends Node {
}

export function generateColorMap(groupNodes: GroupNode[], colors: string[]) {
  const colorMap = new Map<string, string>();
  let groupCount = 0;

  groupNodes.forEach((groupNode) => {
      const color = colors[groupCount % colors.length];
      colorMap.set(groupNode.id, color);
      groupCount++;
  });

  return colorMap;
}


