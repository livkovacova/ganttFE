import React, { useCallback } from 'react';
import ReactFlow, { Node, addEdge, OnConnect, Connection, Position, MarkerType, NodeProps,  } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { Edge } from 'reactflow';
import { PhaseResponse } from './Phase';
import { generateColorMap, setFlowNodePositions } from './NodesUtils';

interface Props {
  phases: PhaseResponse[]
}

const colorOptions = [
    '#81D9D5',
    '#C8E9A0',
    '#F7A278',
    '#CD7A9A',
    '#C497AD',
    '#C497AD',
    '#76BED0',
    '#E9B15D',
    '#8BA4D0',
    '#ffeae5',
    '#b3ccff',
    '#ffd580',
    '#ffcbce',
    '#8fa8ae',
    '#ffd4fa',
    '#E2FDFF',
    '#BFD7FF',
    '#FBF7F4',
    'E8998D',  
    '#E3A587'
]

const prepareNodes = (phases: PhaseResponse[]): Node[] => {
  const allNodes: Node[] = [];
  let newPhasePositionX = 0;
  phases.forEach(phase => {
    const phaseNode: Node = {
      id: `parent-${phase.workId}`,
      data: { label: phase.name },
      type: 'group',
      position: { x: 0, y: 0 },
      className: 'light',
      hidden: true,
      style: { backgroundColor: 'rgba(176, 48, 102, 0.2)', width: 200, height: 200, zIndex: 1 }
    }
    newPhasePositionX += 500;
    allNodes.push(phaseNode);

    phase.tasks.forEach(task => {
      const taskNode: Node = {
        id: `horizontal-${task.workId}`,
        data: { label: task.name },
        position: { x: 0, y: 0 },
        parentNode: `parent-${phase.workId}`,
        sourcePosition: Position.Right,
        expandParent: true,
        style: { zIndex: 3 }
      }
      if (task.predecessors.length === 0) {
        taskNode.type = 'input'
      }
      else {
        taskNode.targetPosition = Position.Left;
      }
      //phase.workId === 0 ? taskNode.hidden = true : taskNode.hidden = false;

      // if(phase.tasks.findIndex(taske => taske.workId===task.workId) == 1){
      //     taskNode.position = {x:50, y:100}
      // }
      allNodes.push(taskNode);
    })
  })
  return allNodes;
}

const newRecursive = (createdNodes: Node[], createdEdges: Edge[]): Node[] => {
  let taskNodes = createdNodes.filter(createdNode => createdNode.type != 'group');
  setFlowNodePositions(taskNodes, createdEdges, 0, 0);

  let phaseNodes: Node[] = createdNodes.filter(createdNode => createdNode.type == 'group');
  const colorMap = generateColorMap(phaseNodes, colorOptions);
  console.log(colorMap);
  phaseNodes.forEach(phaseNode => { taskNodes.push(phaseNode) });
  taskNodes.forEach(taskNode => {
    if(taskNode.type != 'group'){
        taskNode.style!.backgroundColor = colorMap.get(taskNode.parentNode!);
    }
  })

  return taskNodes;
}


const prepareEdges = (phases: PhaseResponse[]): Edge[] => {
  const allEdges: Edge[] = [];
  let edgeId = 0;

  phases.forEach(phase => {
    phase.tasks.forEach(task => {
      task.predecessors.forEach(predecessor => {
        const newEdge: Edge = {
          id: `horizontalEdge-${edgeId}`,
          source: `horizontal-${predecessor}`,
          target: `horizontal-${task.workId}`,
          animated: false,
          type: 'smoothstep',
          pathOptions: {
            borderRadius: 8
          },
          style: { stroke: "white", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed
          }
        };
        edgeId++;
        console.log(newEdge);
        allEdges.push(newEdge);
      })
    });
  })
  return allEdges;
}

const HorizontalFlow = ({ phases }: Props) => {
  const [nodes, setNodes] = React.useState<Node[]>(prepareNodes(phases));
  const [edges, setEdges] = React.useState<Edge[]>(prepareEdges(phases));
  const onConnect: OnConnect = useCallback((params: Connection) => setEdges((els) => addEdge(params, els)), []);

  React.useEffect(() => {
    setNodes(newRecursive(nodes, edges));
  }, []);

  React.useEffect(() => {
    setEdges(prepareEdges(phases))
  }, [nodes]);

  const isAllPrepared = () => {
    console.log("alllprepared")
    console.log(nodes);
    console.log(edges);
    return nodes.length != 0 && edges.length != 0;
  }

  return (
    <>
      {isAllPrepared() ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          fitView
        />
      ) : undefined}
    </>
  );
};

export default HorizontalFlow;
