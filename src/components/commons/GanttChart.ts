import { Phase, PhaseResponse } from "./Phase";

export interface GanttChart {
    id: number;
    phases: Array<PhaseResponse>;
    project: number;
}