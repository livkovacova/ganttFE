import React, { useCallback } from 'react';
import ReactFlow, { Node, addEdge, OnConnect, Connection, Position, MarkerType} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { Edge } from 'reactflow';
import { PhaseResponse } from '../commons/Phase';
import { generateColorMap, positionateNodesToDataFlow } from './NodesUtils';
import TooltipNode from './TooltipNode';
import IUser from '../../types/user.type';
import { number } from 'yup';

interface Props {
    phases: PhaseResponse[]
    teamMembers: IUser[]
    selectedPhases: string[]
    selectedAssignees: string[]
    selectedStates: string[]
  }

const nodeTypes = {
    tooltip: TooltipNode
};

const colorOptions = [
    '#ffcbce',
    '#8fa8ae',
    '#ffd4fa',
    '#CD7A9A',
    '#C497AD',
    '#81D9D5',
    '#C8E9A0',
    '#F7A278',
    '#76BED0',
    '#E9B15D',
    '#C497AD',
    '#8BA4D0',
    '#ffeae5',
    '#b3ccff',
    '#ffd580',
    '#E2FDFF',
    '#BFD7FF',
    '#FBF7F4',
    'E8998D',  
    '#E3A587'
]

const getAssigneesProperty = (assignees: Array<number>, projectMembers: IUser[]): string[] =>{
  const result: Array<string> = [];
  console.log(projectMembers)
  assignees.forEach(assignee => {
      let member = projectMembers.find(member => member.id === assignee);
      if (member !== undefined){
          result.push(member.username);
      }
  })
  return result;
}

const resolveTaskState = (progress: number): string => {
  let state = progress === 0 ? "not started" : progress === 100? "done" : "in progress";
  return state;
}

const resolveHiddenProperty = (selectedPhases: string[], currentPhase: string, selectedUsers: string[], assignees: string[], selectedStates: string[], currentProgress: number) =>{
  console.log(selectedUsers);
  console.log(selectedPhases);
  console.log(assignees);
  console.log(currentPhase);
  let haveAssignee = false;
  selectedUsers.forEach(selected => {
    assignees.forEach(assignee => {
      if(assignee === selected){
        haveAssignee = true;
      }
    })
  })
  let currentState = resolveTaskState(currentProgress);
  const hidden = haveAssignee && selectedPhases.includes(currentPhase) && selectedStates.includes(currentState)? false : true
  return hidden;
}

const prepareNodes = (phases: PhaseResponse[], teamMembers: IUser[]): Node[] => {
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
      const assignees = getAssigneesProperty(task.assignees, teamMembers);
      const taskNode: Node = {
        id: `horizontal-${task.workId}`,
        data: { label: task.name, phaseName: phase.name, assignees: assignees, progress: task.state, duration: task.duration, height:0},
        position: { x: 0, y: 0 },
        parentNode: `parent-${phase.workId}`,
        sourcePosition: Position.Right,
        style: { zIndex: 3, borderRadius: "7px"},
        selectable: true,
        hidden: false
      }
      taskNode.type = 'tooltip'
      if (task.predecessors.length != 0) {
        taskNode.targetPosition = Position.Left;
      }
      else {
        taskNode.data.init = true;
      }

      let thisTaskIsPredacessor = false;
      phases.forEach(phasei => {
        phasei.tasks.forEach(taski => {
            if (taski.predecessors.find(pred => pred == task.workId) != null){
                thisTaskIsPredacessor = true;
            } 
        })
      })
      if(!thisTaskIsPredacessor){
        taskNode.data.output = true;
      }
      allNodes.push(taskNode);
    })
  })
  return allNodes;
}

const positionateNodesRecursive = (createdNodes: Node[], createdEdges: Edge[], selectedPhases: string[], selectedAssignees: string[], selectedStates: string[]): Node[] => {
  let taskNodes = createdNodes.filter(createdNode => createdNode.type != 'group');
  positionateNodesToDataFlow(taskNodes, createdEdges);

  let phaseNodes: Node[] = createdNodes.filter(createdNode => createdNode.type == 'group');
  const colorMap = generateColorMap(phaseNodes, colorOptions);
  console.log(colorMap);
  phaseNodes.forEach(phaseNode => { taskNodes.push(phaseNode) });
  taskNodes.forEach(taskNode => {
    if(taskNode.type != 'group'){
        taskNode.style!.backgroundColor = colorMap.get(taskNode.parentNode!);
    }
    if (taskNode.data.assignees != undefined){
      taskNode.hidden = resolveHiddenProperty(selectedPhases, taskNode.data.phaseName, selectedAssignees, taskNode.data.assignees, selectedStates, taskNode.data.progress);
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


const HorizontalFlow = ({ phases, teamMembers, selectedPhases, selectedAssignees, selectedStates }: Props) => {
  const [nodes, setNodes] = React.useState<Node[]>(prepareNodes(phases, teamMembers));
  const [edges, setEdges] = React.useState<Edge[]>(prepareEdges(phases));
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const onConnect: OnConnect = useCallback((params: Connection) => setEdges((els) => addEdge(params, els)), []);


  React.useEffect(() => {
    setNodes(prepareNodes(phases, teamMembers));
  }, []);
  
  React.useEffect(() => {
    setNodes(positionateNodesRecursive(nodes, edges, selectedPhases, selectedAssignees, selectedStates));
  }, [selectedAssignees, selectedPhases]);

  React.useEffect(() => {
    setNodes(positionateNodesRecursive(nodes, edges, selectedPhases, selectedAssignees, selectedStates));
  }, []);

  React.useEffect(() => {
    setEdges(prepareEdges(phases))
  }, [nodes]);

  const isAllPrepared = () => {
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
          nodeTypes={nodeTypes}
        />
      ) : undefined}
    </>
  );
};

export default HorizontalFlow;
