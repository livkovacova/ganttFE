export default interface IUser {
    id?: any | null,
    username?: string | null,
    email?: string,
    password?: string,
    roles?: Array<string>
}

export interface Role{
    id: number,
    name: string
}

export interface TeamMember {
    id: number,
    username: string,
    email: string,
    roles: Array<Role>
}

export const DEFAULT_USER: IUser = {
    id: 0,
    username: "johnSmith",
    email: "john.smith@example.com",
    password: "secretpassword",
    roles: ["ROLE_TEAM_MEMBER"]
}