import { Task } from "gantt-task-react";
import { GanttChart, MODEL_CHART } from "../commons/GanttChart";
import IUser from "../../types/user.type";
import { PRIORITY } from "../commons/enums";
import { TaskResponse } from "../commons/Task";

interface Props {
  chart: GanttChart,
  currency: string,
  projectMembers: Array<IUser>,
  projectStartDate: Date
}

interface ExtendedTask extends Task {
  priority?: PRIORITY,
  assignees?: string,
  resources?: string,
}

const getNewDate = (date: Date, start: boolean): Date => {
  let newDate = new Date(date);
  if(!start){
      newDate = new Date(newDate.getTime() + 86400000);
  }
  newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
  
  return newDate;
}

function getStartEndDateForProjectPhase(tasks: TaskResponse[]) {
  let start = getNewDate(tasks[0].startDate, true);
  let end = getNewDate(tasks[0].endDate,false);

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const thisTaskStart = getNewDate(tasks[0].startDate, true);
    const thisTaskEnd = getNewDate(tasks[0].endDate,false);
    if (start.getTime() > thisTaskStart.getTime()) {
      start = thisTaskStart;
    }
    if (end.getTime() < thisTaskEnd.getTime()) {
      end = thisTaskEnd;
    }
  }
  return [start, end];
}

export function prepareTasks( chart: GanttChart, currency: string, projectMembers: Array<IUser>, projectStartDate: Date) {

  const getAssigneesProperty = (assignees: Array<number>): string =>{
    const result: Array<string> = [];
    assignees.forEach(assignee => {
        let member = projectMembers.find(member => member.id === assignee);
        if (member != undefined){
            result.push(member.username);
        }
    })
    return result.join(", ");
  }

  const getDependenciesProperty = (dependecies: Array<number>): string[] =>{
      const result: Array<string> = [];
      dependecies.forEach(dependecy => {
          result.push(dependecy.toString())
      })
      return result;
  }

  const preparedTasks: ExtendedTask[] = [];

  MODEL_CHART.phases.forEach(phase => {
    const [phaseStart, phaseEnd] = getStartEndDateForProjectPhase(phase.tasks);
    const newPhase: ExtendedTask = {
      start: new Date(phaseStart.getFullYear(), phaseStart.getMonth(), phaseStart.getDate()),
      end: new Date(phaseEnd.getFullYear(), phaseEnd.getMonth(), phaseEnd.getDate()),
      name: phase.name,
      id: phase.name,
      progress: 0,
      type: "project",
      hideChildren: false,
    }
    preparedTasks.push(newPhase);
    phase.tasks.forEach( task =>{
        const startDate = getNewDate(task.startDate, true);
        const endDate = getNewDate(task.endDate, false);
        const newTask: ExtendedTask = {
          start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
          end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
          name: task.name,
          id: task.workId.toString(),
          progress: 0,
          type: "task",
          project: phase.name,
          priority: task.priority,
          dependencies: getDependenciesProperty(task.predecessors),
          assignees: getAssigneesProperty(task.assignees),
          resources: task.resources.toString() + currency,
        }
        preparedTasks.push(newTask);
    })
  })
  return preparedTasks;
  // const tasks: Task[] = [
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //     name: "Some Project",
  //     id: "ProjectSample",
  //     progress: 25,
  //     type: "project",
  //     hideChildren: false,
  //     displayOrder: 1,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  //     end: new Date(
  //       currentDate.getFullYear(),
  //       currentDate.getMonth(),
  //       2,
  //       12,
  //       28
  //     ),
  //     name: "Idea",
  //     id: "Task 0",
  //     progress: 45,
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 2,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
  //     name: "Research",
  //     id: "Task 1",
  //     progress: 25,
  //     dependencies: ["Task 0"],
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 3,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
  //     name: "Discussion with team",
  //     id: "Task 2",
  //     progress: 10,
  //     dependencies: ["Task 1"],
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 4,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
  //     name: "Developing",
  //     id: "Task 3",
  //     progress: 2,
  //     dependencies: ["Task 2"],
  //     type: "task",
  //     project: "ProjectSample",
  //     displayOrder: 5,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
  //     name: "Review",
  //     id: "Task 4",
  //     type: "task",
  //     progress: 70,
  //     dependencies: ["Task 2"],
  //     project: "ProjectSample",
  //     displayOrder: 6,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //     name: "Release",
  //     id: "Task 6",
  //     progress: currentDate.getMonth(),
  //     type: "milestone",
  //     dependencies: ["Task 4"],
  //     project: "ProjectSample",
  //     displayOrder: 7,
  //   },
  //   {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
  //     name: "Party Time",
  //     id: "Task 9",
  //     progress: 0,
  //     isDisabled: true,
  //     type: "task",
  //   },
  // ];
  //return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}