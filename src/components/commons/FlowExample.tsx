import React, { useCallback } from 'react';
import ReactFlow, { Node, addEdge, OnConnect, Connection, Position, MarkerType } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { Edge } from 'reactflow';
import { PhaseResponse } from './Phase';
import { nodeModuleNameResolver } from 'typescript';

const initialNodes: Node[] = [
    {
        id: 'parent-1',
        type: 'default',
        data: {label: 'Phase 1'},
        style: {width: 200, height:200, backgroundColor: 'lightgray'},
        position: {x:0, y: 0},
        className: 'light'
    },
    {
        id: 'parent-2',
        type: 'default',
        data: {label: 'Phase 2'},
        style: {width: 200, height:200, backgroundColor: 'lightgray'},
        position: {x:300, y: 0},
        className: 'light'
    },
    {
        id: 'parent-3',
        type: 'default',
        data: {label: 'Phase 3'},
        style: {width: 200, height:200, backgroundColor: 'lightgray'},
        position: {x:600, y: 0},
        className: 'light'
    },
    {
      id: 'horizontal-0',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: 'input',
      data: { label: 'Task 0' },
      position: { x: 50, y: 70 },
      parentNode: 'parent-1'
    },
    {
      id: 'horizontal-1',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { label: 'Task 1' },
      position: { x: 50, y: 70 },
      parentNode: 'parent-2'
    },
    {
      id: 'horizontal-2',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { label: 'Task 2' },
      position: { x: 50, y: 70 },
      parentNode: 'parent-3'
    }
  ];
      const initialEdges = [
          {
            id: 'horizontal-e1',
            source: 'horizontal-0',
            type: 'smoothstep',
            target: 'horizontal-1',
            animated: true,
          },
          {
            id: 'horizontal-e2',
            source: 'horizontal-1',
            type: 'smoothstep',
            target: 'horizontal-2',
            animated: true,
          },
          {
            id: 'horizontal-e3',
            source: 'horizontal-2',
            type: 'smoothstep',
            target: 'horizontal-3',
            animated: true
          },
        ];

      interface Props {
        phases: PhaseResponse[]
      }

      const prepareNodes = (phases: PhaseResponse[]): Node[] => {
        const allNodes: Node[] = [];
        let newPhasePositionX = 0;
        phases.forEach(phase => {
            const phaseNode: Node = {
                id: `parent-${phase.workId}`,
                data: { label: phase.name},
                type: 'group',
                position: {x: 10, y: 0},
                className: 'light',
                style: {backgroundColor: 'rgba(176, 48, 102, 0.20)', width: 200, height: 200, zIndex:1}
            }
            newPhasePositionX += 500;
            allNodes.push(phaseNode);

            phase.tasks.forEach(task => {
                const taskNode: Node = {
                    id: `horizontal-${task.workId}`,
                    data: {label: task.name},
                    position: {x: 50, y: 0},
                    parentNode: `parent-${phase.workId}`,
                    sourcePosition : Position.Right,
                    expandParent: true,
                    style: {zIndex:3}
                }
                if(task.predecessors.length === 0){
                    taskNode.type = 'input'
                }
                else{
                    taskNode.targetPosition = Position.Left;
                }
                if(phase.tasks.findIndex(taske => taske.workId===task.workId) == 1){
                    taskNode.position = {x:50, y:100}
                }
                allNodes.push(taskNode);
            })
        })
        return allNodes;
      }

      const editPositions = (phases: PhaseResponse[], createdNodes: Node[], createdEdges: Edge[]): Node[] => {
        const initNodes = createdNodes.filter(createdNode => createdNode.type === 'input');
        console.log(createdNodes);
        const createdPhases = createdNodes.filter(createdNode => createdNode.type === 'group');
        const updatedNodes: Node[] = [];
        createdPhases.forEach(createdPhase => {
            let phaseWidth = 250; //250
            let phaseHeight = 0; //90
            let phaseInitNodes = initNodes.filter(node => node.parentNode == createdPhase.id);
            console.log(phaseInitNodes);
            let newY = 20;
            phaseInitNodes.forEach(phaseInitNode => {
                phaseInitNode.position = {x: 50, y: newY}
                newY += 90;
                phaseHeight +=90;
                let successors = createdEdges.filter(createdEdge => createdEdge.source === phaseInitNode.id);
                successors.forEach(successor => {
                    //updatePositionOfSuccessor(successor, phaseWidth, phaseHeight);
                })
            })
            createdPhase.style!.width = phaseWidth;
            createdPhase.style!.height = phaseHeight;
            createdNodes.forEach(createdNode => {
                let founded = phaseInitNodes.find(node => node.id === createdNode.id);
                if(founded){
                    updatedNodes.push(founded);
                }else if(createdPhase.id === createdNode.id){
                    updatedNodes.push(createdPhase);
                }else{
                    updatedNodes.push(createdNode);
                }
            })
        })
        
        return updatedNodes;
      }

      function setNewPosition(task: Node, createdEdges: Edge[], column: number, x: number, y: number, updatedTasks: Node[]): void {
        task.position.x = x + column * 150;
        task.position.y = y;
        let maxHeight = 0;

        let predIds = createdEdges.map(createdEdge => {
            if(createdEdge.target == task.id){
                return createdEdge.source;
            }
        })
        let predacessors = updatedTasks.filter(createdNode => predIds.find(predId => predId === createdNode.id) != null)
        console.log(task.id);
        console.log(predacessors);
        //update sprav
        for (let predecessor of predacessors) {
          setNewPosition(predecessor, createdEdges, column - 1, x, y, updatedTasks);
          y += 30;
          maxHeight = Math.max(maxHeight, predecessor.position.y + 30);
        }
        task.position.y = maxHeight;
      }

      const recursiveEditPositions = (phases: PhaseResponse[], createdNodes: Node[], createdEdges: Edge[]): Node[] => {
        let taskNodes = createdNodes.filter(createdNode => createdNode.type != 'group');
        taskNodes.forEach(node => {
            setNewPosition(node, createdEdges, taskNodes.length - 1, 0, 0, taskNodes);
        })
        
        let phaseNodes: Node[] = createdNodes.filter(createdNode => createdNode.type == 'group');
        phaseNodes.forEach(phaseNode => {taskNodes.push(phaseNode)});
        return taskNodes;
      }

      const prepareEdges = (phases: PhaseResponse[]) : Edge[] => {
        const allEdges: Edge[] = [];
        let edgeId = 0;

        phases.forEach(phase => {
            phase.tasks.forEach(task => {
                task.predecessors.forEach(predecessor => {
                    const newEdge: Edge = { 
                        id: `horizontalEdge-${edgeId}`, 
                        source: `horizontal-${predecessor}` , 
                        target: `horizontal-${task.workId}`, 
                        animated: false, 
                        type: 'smoothstep',
                        pathOptions:{
                            borderRadius: 8
                        },
                        style: {stroke: "white", strokeWidth:2},
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
      
      const HorizontalFlow = ({phases}: Props) => {
        const [nodes, setNodes] = React.useState<Node[]>(prepareNodes(phases));
        const [edges, setEdges] = React.useState<Edge[]>(prepareEdges(phases));
        const onConnect: OnConnect = useCallback((params: Connection) => setEdges((els) => addEdge(params, els)), []);

        React.useEffect(() => {
            setNodes(recursiveEditPositions(phases, nodes, edges));
        },[]);

        React.useEffect(() => {
            setEdges(prepareEdges(phases))
        },[nodes]);

        const isAllPrepared = () => {
            console.log("alllprepared")
            console.log(nodes);
            console.log(edges);
            return nodes.length != 0 && edges.length != 0;
        }
      
        return (
            <>
            {isAllPrepared()? (
                <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                fitView
                />
            ): undefined}
          </>
        );
      };
      
      export default HorizontalFlow;
      