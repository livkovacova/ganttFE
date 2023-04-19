import axios from "axios";
import { Phase } from "../components/commons/Phase";
import { GanttChart } from "../components/commons/GanttChart";
import authHeader from "./AuthHeader";
import eventBus from "../components/commons/EventBus";

const API_URL = "http://localhost:8080/api/ganttChart";

export const createGanttChart = async (projectId: number, phases: Phase[]): Promise<GanttChart> => {
    return axios.post(API_URL + "/create", {
            projectId: projectId,
            phases: phases
        }, { headers: authHeader() }
    )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error creating gantt chart", err);
        if (err.response && err.response.status === 401) {
            eventBus.dispatch("logout");
        }
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
        if (err.response && err.response.status === 401) {
            eventBus.dispatch("logout");
        }
        return {};
    })
}

export const uploadGanttChart= async (ganttChart: GanttChart) => {
    return axios.post(API_URL + "/save", ganttChart, { headers: authHeader() })
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error uploading gantt chart", err);
        if (err.response && err.response.status === 401) {
            eventBus.dispatch("logout");
        }
        return {};
    })
}