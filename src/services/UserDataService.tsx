import axios from "axios";
import IUser, { TeamMember } from "../types/user.type";

const API_URL = "http://localhost:8080/api/users/";

export const getAllTeamMembers = async (): Promise<Array<TeamMember>> => {
    return axios.get(API_URL + "allTeamMembers", {
    } )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error fetching team members", err);
        return {};
    })
}