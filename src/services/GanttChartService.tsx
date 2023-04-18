import axios from "axios";
import { Phase } from "../components/commons/Phase";
import { GanttChart } from "../components/commons/GanttChart";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/ganttChart";

export const createGanttChart = async (projectId: number, phases: Phase[]): Promise<GanttChart> => {
    return axios.post(API_URL + "/create", {
            projectId: projectId,
            phases: phases
        }
    )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error creating gantt chart", err);
        return {};
    })
}

export const getGanttChart= async (id: number): Promise<GanttChart> => {
    return axios.get(API_URL, {
        params: {
            id: id,
        },
        headers: authHeader() 
    } )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error fetching gantt chart", err);
        return {};
    })
}

export const uploadGanttChart= async (ganttChart: GanttChart) => {
    return axios.post(API_URL + "/save", ganttChart)
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error saving gantt chart", err);
        return {};
    })
}

export const updateGanttChart= async (ganttChart: GanttChart) => {
    return axios.post(API_URL + "/update", ganttChart)
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error saving gantt chart", err);
        return {};
    })
}