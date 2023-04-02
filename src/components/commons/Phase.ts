import { Task } from "./Task";

export interface Phase {
    name: string;
    tasks: Array<Task>;
}

export const DEFAULT_PHASE: Phase = {
    name: "",
    tasks: []
}