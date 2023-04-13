import { PRIORITY } from "./enums";

export interface Task {
    workId: number;
    name: string;
    duration: number;
    priority: number;
    assignees: Array<number>;
    resources: number;
    predecessors: Array<number>;
    extendable: boolean;
}

export const DEFAULT_TASK: Task = {
    workId: 0,
    name: "New task",
    duration: 0,
    priority: 0,
    assignees: [],
    resources: 0,
    predecessors: [],
    extendable: true
}

export interface TaskResponse {
    workId: number;
    name: string;
    priority: PRIORITY; //string
    duration: number;
    resources: number;
    extendable: boolean;
    predecessors: Array<number>;
    assignees: Array<number>;
    startDate: Date;
    endDate: Date;
}