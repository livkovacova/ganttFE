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