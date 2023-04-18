import axios from "axios";
import { PageData } from "../components/commons/PageData";
import { Project } from "../components/commons/Projects";

const API_URL = "http://localhost:8080/api/projects/";

export const getProjectsForUserById = async (userId: number, role: string): Promise<Array<Project>> => {
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

export const getProjectById= async (id: number): Promise<Project> => {
    return axios.get(API_URL + "project", {
        params: {
            id: id,
        }
    } )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error fetching project", err);
        return {};
    })
}

export const createProject = async (projectName: string, projectDescription: string, manager: number, members: number[], resources: number, currency: string, startDate: Date) => {
    return axios.post(`${API_URL}save`, {
        name: projectName,
        description: projectDescription,
        manager: manager,
        resources: resources,
        currency: currency,
        members: members,
        startDate: startDate
    })
    .then((res: any) => console.log("Project succesfully created"))
    .catch((err: any) => {
        console.error("Error creating projects", err);
        return {};
    });
};

export const editProject = async (id: number, projectName: string, projectDescription: string, manager: number, members: number[], resources: number, currency: string, startDate: Date) => {
    return axios.post(`${API_URL}update`, {
        id: id,
        name: projectName,
        description: projectDescription,
        manager: manager,
        resources: resources,
        currency: currency,
        members: members,
        startDate: startDate
    })
    .then((res: any) => console.log("Project succesfully edited"))
    .catch((err: any) => {
        console.error("Error editing projects", err);
        return {};
    });
};

export const deleteProject = async (projectId: number) => {
    return axios.delete(API_URL + "delete", {
        params: {id: projectId}
    } )
    .then((res: any) => console.log("Project succesfully deleted"))
    .catch((err: any) => {
        console.error("Error deleting project", err);
        return {};
    })
}

export const setDependencyDiagramCreated = async (projectId: number) => {
    return axios.post(API_URL + "depCreated", {
        params: {id: projectId}
    } )
    .then((res: any) => console.log("Project succesfully changed"))
    .catch((err: any) => {
        console.error("Error changing project", err);
        return {};
    })
}