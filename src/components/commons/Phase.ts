import { Task, TaskResponse } from "./Task";

export interface Phase {
    workId: number;
    name: string;
    tasks: Array<Task>;
}

export const DEFAULT_PHASE: Phase = {
    workId: 0,
    name: "",
    tasks: []
}

export interface PhaseResponse {
    workId: number;
    name: string;
    tasks: Array<TaskResponse>;
    projectId: number;
    realId?: number
}