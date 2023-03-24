import axios from "axios";
import { Project } from "../components/Examples/Projects";

const API_URL = "http://localhost:8080/api/projects/";

export const getProjectsById = async (userId: number, role: string): Promise<Array<Project>> => {
    return axios.get(API_URL + "byUser", {
        params: {
            userId: userId,
            role: role.slice(5)
        }
    } )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error fetching projects", err);
        return {};
    })
}