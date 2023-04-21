import { BooleanLiteral } from "typescript";
import IUser, { DEFAULT_USER } from "../../types/user.type";
import { GanttChartInfo } from "./GanttChart";

export interface Project {
    id: number;
    name: string;
    description: string;
    manager: IUser;
    resources: number;
    currency: string;
    members: Array<IUser>;
    startDate?: Date | null,
    ganttCreated: boolean,
    treeCreated: boolean,
    ganttChartInfo?: GanttChartInfo
}

export const DEFAULT_PROJECT: Project = {
    id: 0,
    name: "",
    description: "",
    manager: DEFAULT_USER,
    resources: 0,
    currency: "EUR",
    members: [DEFAULT_USER],
    startDate: new Date(),
    ganttCreated: false,
    treeCreated: false, 
    ganttChartInfo: undefined
};