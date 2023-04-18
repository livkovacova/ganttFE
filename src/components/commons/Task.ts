import { PRIORITY } from "./enums";

export interface Task {
    workId: number;
    name: string;
    duration: number;
    priority: PRIORITY;
    assignees: Array<number>;
    resources: number;
    predecessors: Array<number>;
}

export const DEFAULT_TASK: Task = {
    workId: 0,
    name: "New task",
    duration: 0,
    priority: PRIORITY.MEDIUM,
    assignees: [],
    resources: 0,
    predecessors: [],
}

export interface TaskResponse {
    workId: number;
    name: string;
    priority: PRIORITY; //string
    duration: number;
    resources: number;
    predecessors: Array<number>;
    assignees: Array<number>;
    startDate: Date;
    endDate: Date;
    realId?: number
}