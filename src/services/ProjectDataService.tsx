import axios from "axios";
import { PageData } from "../components/commons/PageData";
import { Project } from "../components/commons/Projects";

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

export const getPageOfProjects = async (userId: number, role: string, page?: number, size?: number): Promise<PageData<Project>> => {
    return axios.get(API_URL + "byUserPaged", {
        params: {
            userId: userId,
            role: role.slice(5),
            page: page,
            size: size,
        }
    })
                .then((res: any) => res.data)
                .catch((err: any) => {
                    console.error("Error fetching paged projects", err);
                    return {};
                });
};