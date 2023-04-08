import axios from "axios";
import { Phase } from "../components/commons/Phase";

const API_URL = "http://localhost:8080/api/ganttChart/";

export const createGanttChart = async (projectId: number, phases: Phase[]) => {
    return axios.post(API_URL, {
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