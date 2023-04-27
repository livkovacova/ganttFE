import axios from "axios";
import IUser, { TeamMember } from "../types/user.type";
import authHeader from "./AuthHeader";
import eventBus from "../components/commons/EventBus";

const API_URL = "https://lk-gantt-app.herokuapp.com/api/users/";

export const getAllTeamMembers = async (): Promise<Array<TeamMember>> => {
    return axios.get(API_URL + "allTeamMembers", {
        headers: authHeader()
    } )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error fetching team members", err);
        if (err.response && err.response.status === 401) {
            eventBus.dispatch("logout");
        }
        return {};
    })
}
