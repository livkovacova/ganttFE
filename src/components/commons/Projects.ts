import IUser, { DEFAULT_USER } from "../../types/user.type";

export interface Project {
    id: number;
    name: string;
    description: string;
    manager: IUser;
    resources: number;
    members: Array<IUser>;
    startdate?: Date | null
}

export const DEFAULT_PROJECT: Project = {
    id: 0,
    name: "",
    description: "",
    manager: DEFAULT_USER,
    resources: 0,
    members: [DEFAULT_USER],
    startdate: new Date()
};