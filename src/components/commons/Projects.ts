import { BooleanLiteral } from "typescript";
import IUser, { DEFAULT_USER } from "../../types/user.type";

export interface Project {
    id: number;
    name: string;
    description: string;
    manager: IUser;
    resources: number;
    currency: string;
    members: Array<IUser>;
    startdate?: Date | null,
    ganttCreated: boolean,
    treeCreated: boolean
}

export const DEFAULT_PROJECT: Project = {
    id: 0,
    name: "",
    description: "",
    manager: DEFAULT_USER,
    resources: 0,
    currency: "EUR",
    members: [DEFAULT_USER],
    startdate: new Date(),
    ganttCreated: false,
    treeCreated: false
};