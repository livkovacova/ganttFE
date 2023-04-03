export interface Task {
    workid: number;
    name: string;
    duration: number;
    priority: number;
    assignees: Array<number>;
    resources: number;
    predecessors: Array<number>;
    extendable: boolean;
}

export const DEFAULT_TASK: Task = {
    workid: 0,
    name: "New task",
    duration: 0,
    priority: 0,
    assignees: [],
    resources: 0,
    predecessors: [],
    extendable: true
}