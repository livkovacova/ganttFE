import { Node, Edge } from "react-flow-renderer";

export interface FlowNode extends Node {
  position: { x: number; y: number };
  parentNode?: string;
}

interface FlowEdge extends Edge {}

export interface NodePos {
  xPos: number,
  yPos: number
}

const COLUMN_WIDTH = 250;
const ROW_HEIGHT = 125;
const COLUMN_MARGIN = 25;
const ROW_MARGIN = 20;

export const computePositions = (nodes: FlowNode[], edges: FlowEdge[]): Map<FlowNode, NodePos> => {
  let visited = new Set<FlowNode>();
  let positionsMap = new Map<FlowNode, NodePos>();
  let maxRowValue = new Map<number,number>();
  let sourceMap = new Map<FlowNode, Set<FlowNode>>();

  nodes.forEach(node => {
    const sources = edges
      .filter((e) => e.target === node.id)
      .map((e) => nodes.find((n) => n.id === e.source))
      .filter((n): n is FlowNode => n !== undefined);
      sourceMap.set(node, new Set(sources));
  })

  function computeFlowNodePosition(node: FlowNode) {
    if (visited.has(node)){
      let oldY = maxRowValue.get(positionsMap.get(node)!.yPos);
      maxRowValue.set(positionsMap.get(node)!.xPos, oldY!-1);
      console.log(maxRowValue);
    } 

    const targets = edges
      .filter((e) => e.source === node.id)
      .map((e) => nodes.find((n) => n.id === e.target))
      .filter((n): n is FlowNode => n !== undefined && !visited.has(n));

    let sources = sourceMap.get(node);
    let allSourcesVisited = true;
      sources?.forEach(source => {
        if(!visited.has(source)){
          console.log(node);
          console.log(source);
          console.log(visited);
          allSourcesVisited = false;
        }
      })

    // Recursively set the position of each target
    if(allSourcesVisited){
      visited.add(node);
      if(sources?.size != 0){
        let maxX = 0;
        Array.from(sources!).forEach(source => {
          if (positionsMap.get(source) != null){
            if(positionsMap.get(source)!.xPos > maxX){
              maxX = positionsMap.get(source)!.xPos;
            }
          }
        })
        positionsMap.set(node, {xPos: maxX+1, yPos:maxRowValue.get(maxX+1)!})
      }
    
      targets.forEach((tgt) => {
          console.log(node);
          console.log(positionsMap);
          let rootX = positionsMap.get(node)!.xPos + 1;
          let maxRootY = maxRowValue.get(positionsMap.get(node)!.xPos + 1);
          if(maxRootY === undefined){
            maxRowValue.set(rootX, 0);
            positionsMap.set(tgt, {xPos: rootX, yPos: 0});
          }
          else{
            let newY = maxRowValue.get(rootX)! + 1;
            maxRowValue.set(rootX, newY);
            positionsMap.set(tgt, {xPos: rootX, yPos: newY});
          }
          computeFlowNodePosition(tgt);
      })
    }

  }

  // Start by setting the positions of nodes without sources
  const roots = nodes.filter((n) => !edges.some((e) => e.target === n.id));
  let xx = 0;
  let yy = 0
  roots.forEach((root) => {
    let pos: NodePos = {
      xPos: xx,
      yPos: yy
    }
    positionsMap.set(root, pos);
    maxRowValue.set(xx, yy);
    yy++;
    computeFlowNodePosition(root)
  });

  console.log(positionsMap);
  console.log(maxRowValue);
  return positionsMap;
}

export const positionateNodesToDataFlow = (nodes: FlowNode[], edges: Edge[]) => {
  const positionsMap = computePositions(nodes, edges);
  nodes.forEach(node => {
    node.position.x = COLUMN_WIDTH * (positionsMap.get(node)!.xPos) + COLUMN_MARGIN;
    node.position.y = ROW_HEIGHT * (positionsMap.get(node)!.yPos) + ROW_MARGIN;
  })
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


