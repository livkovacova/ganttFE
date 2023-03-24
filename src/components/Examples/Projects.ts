import IUser from "../../types/user.type";

export interface Project {
    id: number;
    name: string;
    description: string;
    manager: IUser | null;
    resources: number;
    members: Array<IUser>;
}