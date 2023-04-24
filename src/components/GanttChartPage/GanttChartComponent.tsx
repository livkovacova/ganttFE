import React from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSettings } from "./ChartViewSwitcher";
import { ExtendedTask, getStartEndDateForProject, prepareTasks } from "./GanttChartUtils";
import "gantt-task-react/dist/index.css";
import './GanttChartComponent.css'
import { GanttChart } from "../commons/GanttChart";
import IUser from "../../types/user.type";
import { Button, Dialog, DialogActions, DialogTitle, Typography } from "@mui/material";
import { TaskResponse } from "../commons/Task";
import { TeamMemberOption } from "../commons/TeamMemberOption";

interface Props {
  chart: GanttChart,
  currency: string,
  projectMembers: Array<IUser>,
  projectStartDate: Date,
  onDateChange: (chart: GanttChart) => void;
  readonly: boolean
  isManager: boolean
}

export const GanttChartComponent = ({ chart, currency, projectMembers, projectStartDate, onDateChange, readonly, isManager }: Props) => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(prepareTasks(chart, currency, projectMembers, projectStartDate, readonly));
  const [isChecked, setIsChecked] = React.useState(true);
  const [taskToEdit, setTaskToEdit] = React.useState<Task>({} as Task);
  
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const onDeleteDialogClick = () => setDeleteDialogOpen(true);
  const onDeleteDialogClose = () => setDeleteDialogOpen(false);

  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const onEditDialogClick = () => setEditDialogOpen(true);
  const onEditDialogClose = () => setEditDialogOpen(false);  

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    chart.phases.forEach(phase => {
      phase.tasks.map(phaseTask => {
        if (phaseTask.workId === parseInt(task.id)) {
          phaseTask.startDate = task.start;
          phaseTask.endDate = task.end;
          const newDuration = task.end.getTime() - task.start.getTime();
          phaseTask.duration = Math.ceil(newDuration / (1000 * 3600 * 24));
        }
      })
    })
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    onDateChange(chart);
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    setTasks(tasks.filter(t => t.id !== task.id));
    chart.phases.forEach(phase => {
      phase.tasks = phase.tasks.filter(phaseTask => phaseTask.workId != parseInt(task.id));
    })
    chart.phases.forEach(phase => {
      phase.tasks.map(phaseTask => {
        phaseTask.predecessors = phaseTask.predecessors.filter(predecessor => predecessor != parseInt(task.id));
      })
    })
    onDeleteDialogClose();
    return true;
  };

  const handleTaskEdit = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    onEditDialogClose();
    return true;
  };

  const openTaskDeleteDialog = (task: Task) => {
    onDeleteDialogClick();
    setTaskToEdit(task);
  };

  const openEditTaskDialog = (task: Task) => {
    onEditDialogClick();
    setTaskToEdit(task);
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    chart.phases.forEach(phase => {
      phase.tasks.map(phaseTask => {
        if (phaseTask.workId === parseInt(task.id)) {
          phaseTask.state = task.progress;
        }
      })
    })
    console.log("On progress change Id:" + task.id);
  };

  const computeGanttWidth = (): number => {
    return 50 * (tasks.length) > window.innerHeight * 0.67 ? window.innerHeight * 0.67 : 50 * (tasks.length);
  }

  const prepareAssigneesOptions = (): TeamMemberOption[] => {
    const options = projectMembers.map((teamMember) => {
            console.log(teamMember.id)
            let option: TeamMemberOption = {
                value: teamMember.id,
                text: teamMember.username
            };
            return option;
        }
    );
    return options;
};

  const MyCustomizedTooltip: React.FC<{ task: ExtendedTask, fontSize: string, fontFamily: string }> = ({ task, fontSize, fontFamily }) => {
    const style = {
      fontSize,
      fontFamily
    };
    return (
      <div className="tooltipContainer" style={style}>
        <b style={{ fontSize: fontSize + 6 }}>{`${task.name
          }: ${task.start.toLocaleDateString()} - ${task.end.toLocaleDateString()}`}</b>
        {task.end.getTime() - task.start.getTime() !== 0 && (
          <div className="tooltipParagraph">{`Duration: ${~~(
            (task.end.getTime() - task.start.getTime()) /
            (1000 * 60 * 60 * 24)
          )} day(s)`}</div>
        )}
        {task.type === "task" ?
          (<>
            <div className="tooltipParagraph">Priority: {task.priority}</div>
            <div className="tooltipParagraph">Assignees: {task.assignees}</div>
            <div className="tooltipParagraph">Progress: {task.progress}%</div>
            {isManager ?
              (<>
                <div className="tooltipParagraph">Resources: {task.resources}</div>
              </>)
              :
              (undefined)
            }
          </>)
          :
          (undefined)
        }

      </div>
    )
  }

  return (
    <div className="Wrapper">
      <ViewSettings
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        showTaskList={isChecked}
      />
      <Gantt
        tasks={tasks}
        viewMode={view}
        fontFamily="Raleway, sans-serif"
        onDateChange={handleTaskChange}
        onDelete={openTaskDeleteDialog}
        onDoubleClick={openEditTaskDialog}
        onExpanderClick={handleExpanderClick}
        onProgressChange={handleProgressChange}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={computeGanttWidth()}
        columnWidth={columnWidth}
        TooltipContent={MyCustomizedTooltip}
        projectBackgroundColor='#B03066'
        todayColor="rgba(245, 139, 0, 0.3)"
        barProgressColor="rgb(160 162 168)"
        barProgressSelectedColor='rgb(255 195 111)'
        projectProgressColor='#B03066'
        projectBackgroundSelectedColor="rgb(138 19 70)"
        projectProgressSelectedColor="rgb(138 19 70)"
      />
      <Dialog open={isDeleteDialogOpen} onClose={onDeleteDialogClose}>
                 <DialogTitle>
                    <Typography variant="body1">Are you sure you want to delete "{taskToEdit.name}" task?</Typography>
                    <Typography color="primary" variant="body2">This task will be removed as predeccesor from dependent tasks too.</Typography> 
                </DialogTitle>
                <DialogActions>
                    <Button onClick={onDeleteDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={() => handleTaskDelete(taskToEdit)} color="warning" variant="contained">Delete</Button>
                </DialogActions>
      </Dialog>
      <Dialog open={isEditDialogOpen} onClose={onEditDialogClose}>
                 <DialogTitle>
                    <Typography variant="h5">{taskToEdit.name}</Typography>
                    <Typography variant="body2">Edit task details</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={onEditDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={() => handleTaskEdit(taskToEdit)} color="warning" variant="contained">Save</Button>
                </DialogActions>
      </Dialog>
    </div>
  );
}