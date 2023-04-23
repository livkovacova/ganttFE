import { Node, Edge } from "react-flow-renderer";

export interface FlowNode extends Node {
  position: { x: number; y: number };
  parentNode?: string;
}

interface FlowEdge extends Edge {}

export interface NodePos {
  xPos: number,
  yPos: number,
  nodeHeight: number
}

const COLUMN_WIDTH = 350;
const ROW_HEIGHT = 125;
const COLUMN_MARGIN = 25;
const ROW_MARGIN = 20;

export const computePositions = (nodes: FlowNode[], edges: FlowEdge[]): Map<FlowNode, NodePos> => {
  let visited = new Set<FlowNode>();
  let positionsMap = new Map<FlowNode, NodePos>();
  let maxRowValue = new Map<number,number>();
  let sourceMap = new Map<FlowNode, Set<FlowNode>>();

  function computeNodeHeight(node: FlowNode){
    let assignees = node.data.assignees;
    let rows = 0;
    let rowWidth = 0;
    let assigneesBoxHeight = 0;
    if(assignees.length < 3){
      assigneesBoxHeight = 40;
    }
    else{
      assignees.forEach((assignee: string) => {
        let thisWidth = 0;
        console.log(assignee.length);
        if(assignee.length > 4){
            thisWidth = 30;
        }
        else{
          thisWidth = 25;
        }
        rowWidth += thisWidth;
        console.log(rowWidth);
        if(rowWidth > 170){
          rows++;
          rowWidth = thisWidth;
        }
      });
      assigneesBoxHeight = rows === 0 ? 40 : (rows * 70) + 10;
    }
    return 109 + assigneesBoxHeight + 20;
  } 

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
        positionsMap.set(node, {xPos: maxX+1, yPos:maxRowValue.get(maxX+1)!, nodeHeight: computeNodeHeight(node)})
      }
    
      targets.forEach((tgt) => {
          console.log(node);
          console.log(positionsMap);
          let rootX = positionsMap.get(node)!.xPos + 1;
          let maxRootY = maxRowValue.get(positionsMap.get(node)!.xPos + 1);
          if(maxRootY === undefined){
            maxRowValue.set(rootX, 0);
            positionsMap.set(tgt, {xPos: rootX, yPos: 0, nodeHeight: computeNodeHeight(tgt)});
          }
          else{
            let newY = maxRowValue.get(rootX)! + 1;
            maxRowValue.set(rootX, newY);
            positionsMap.set(tgt, {xPos: rootX, yPos: newY, nodeHeight:computeNodeHeight(tgt)});
          }
          computeFlowNodePosition(tgt);
      })
    }
    else{
      positionsMap.set(node, {xPos: positionsMap.get(node)!.xPos, yPos:positionsMap.get(node)!.yPos, nodeHeight: computeNodeHeight(node)})
      maxRowValue.set(positionsMap.get(node)!.xPos, 0);
    }

  }

  // Start by setting the positions of nodes without sources
  const roots = nodes.filter((n) => !edges.some((e) => e.target === n.id));
  let xx = 0;
  let yy = 0
  roots.forEach((root) => {
    let pos: NodePos = {
      xPos: xx,
      yPos: yy,
      nodeHeight: computeNodeHeight(root)
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
    const row = positionsMap.get(node)!.yPos;
    const maxRowHeight = [...positionsMap.values()]
    .filter((nodePos) => nodePos.yPos === row)
    .reduce((max, nodePos) => (nodePos.nodeHeight > max ? nodePos.nodeHeight : max), 0);
    console.log(maxRowHeight);
    console.log(positionsMap);
    node.position.x = COLUMN_WIDTH * (positionsMap.get(node)!.xPos) + COLUMN_MARGIN;
    node.position.y = (maxRowHeight+30) * (positionsMap.get(node)!.yPos) + ROW_MARGIN;
    node.data.height = positionsMap.get(node)!.nodeHeight;
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


