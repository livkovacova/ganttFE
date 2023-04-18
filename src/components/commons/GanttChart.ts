import { Phase, PhaseResponse } from "./Phase";
import { PRIORITY } from "./enums";

export interface GanttChart {
    id: number;
    phases: Array<PhaseResponse>;
    project: number;
}

export const DEFAULT_CHART: GanttChart = {
    id: 0,
    phases: [],
    project: 0
}