import { Task } from "./Task";

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