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

export interface ExtendedTask extends Task {
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
    const thisTaskStart = getNewDate(task.startDate, true);
    const thisTaskEnd = getNewDate(task.endDate,false);
    if (start.getTime() > thisTaskStart.getTime()) {
      start = thisTaskStart;
    }
    if (end.getTime() < thisTaskEnd.getTime()) {
      end = thisTaskEnd;
    }
    console.log(start);
    console.log(end);
  }
  return [start, end];
}

export function prepareTasks( chart: GanttChart, currency: string, projectMembers: Array<IUser>, projectStartDate: Date) {

  const getAssigneesProperty = (assignees: Array<number>): string =>{
    const result: Array<string> = [];
    assignees.forEach(assignee => {
        let member = projectMembers.find(member => member.id === assignee);
        if (member !== undefined){
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
          resources: task.resources.toString() + " " + currency,
        }
        preparedTasks.push(newTask);
    })
  })
  return preparedTasks;
  
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