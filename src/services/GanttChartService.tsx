import axios from "axios";
import { Phase } from "../components/commons/Phase";
import { GanttChart, GanttChartInfo } from "../components/commons/GanttChart";
import authHeader from "./AuthHeader";
import eventBus from "../components/commons/EventBus";

const API_URL = "https://lk-gantt-app.herokuapp.com/api/ganttChart";

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

export const uploadGanttChart= async (ganttChart: GanttChart): Promise<GanttChart> => {
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

export const updateGanttChart= async (ganttChart: GanttChart) => {
    return axios.post(API_URL + "/edit", ganttChart, { headers: authHeader() })
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error editing gantt chart", err);
        if (err.response && err.response.status === 401) {
            eventBus.dispatch("logout");
        }
        return {};
    })
}

export const getGanttChartInfo= async (id: number): Promise<GanttChartInfo> => {
    return axios.get(API_URL + "/info", {
        params: {
            id: id,
        },
        headers: authHeader()
    } )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error fetching gantt chart info", err);
        if (err.response && err.response.status === 401) {
            eventBus.dispatch("logout");
        }
        return {};
    })
}