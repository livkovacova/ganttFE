import React, {useEffect, useState} from "react";

export interface Phasee {
    name: string;
    tasks: Task[];
    children?: Phasee[];
  }
  
  interface Task {
    name: string;
    completed: boolean;
    dependencies?: string[];
  }
  
  interface Props {
    phases: Phasee[];
  }
  
  const PhaseTask = ({ task }: { task: Task }) => {
    return (
        <div>
          <span>{task.name}</span>
          <span>{task.completed ? "✓" : " "}</span>
          {task.dependencies &&
            task.dependencies.map((dependency) => (
              <span key={dependency}>→ {dependency} </span>
            ))}
        </div>
      );
  };
  
  const Phase = ({ phase }: { phase: Phasee }) => {
    const [expanded, setExpanded] = useState(false);
  
    const toggleExpanded = () => {
      setExpanded(!expanded);
    };
  
    return (
      <div>
        <div onClick={toggleExpanded}>
          <span>{phase.name}</span>
          {phase.children && (
            <span>{expanded ? "▼" : "▶"}</span>
          )}
        </div>
        {expanded &&
          phase.children?.map((child) => (
            <Phase key={child.name} phase={child} />
          ))}
        {phase.tasks.map((task) => (
          <PhaseTask key={task.name} task={task} />
        ))}
      </div>
    );
  };
  
  const Tree = ({ phases }: Props) => {
    return (
      <div>
        {phases.map((phase) => (
          <Phase key={phase.name} phase={phase} />
        ))}
      </div>
    );
  };
  
  export default Tree;
  