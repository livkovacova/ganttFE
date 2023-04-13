import axios from "axios";
import { Phase } from "../components/commons/Phase";
import { GanttChart } from "../components/commons/GanttChart";

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
        }
    } )
    .then((res: any) => res.data)
    .catch((err: any) => {
        console.error("Error fetching gantt charts", err);
        return {};
    })
}