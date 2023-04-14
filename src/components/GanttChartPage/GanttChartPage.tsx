import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { responsiveFontSizes } from '@mui/material/';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import "../CreateGanttChartPage/CreateGanttChartPage.css"
import { createGanttChart, getGanttChart } from "../../services/GanttChartService";
import { Phase } from "../commons/Phase";
import { Project } from "../commons/Projects";
import _without from "lodash/without";
import { useLocation } from "react-router-dom";
import { DEFAULT_CHART, GanttChart } from "../commons/GanttChart";
import { GanttChartComponent } from "./GanttChartComponent";
import { AnotherTry } from "./GnattChartV2";

const theme = responsiveFontSizes(mainTheme);

export const GanttChartPage = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const project: Project = location.state.project;
    const currentUser: IUser = location.state.currentUser;
    const phases: Phase[] = location.state.phases;
    const alreadyCreated: boolean = location.state.alreadyCreated;
    const [ganttChart, setGanttChart] = useState<GanttChart>(DEFAULT_CHART);

    const generateGanttChart = async () => {
        const chart: GanttChart = await createGanttChart(parseInt(id!), phases);
        setGanttChart(chart);
    };

    const fetchGanttChart = async () => {
        const chart: GanttChart = await getGanttChart(parseInt(id!));
        setGanttChart(chart)
    }

    useEffect(() => {
        if(!alreadyCreated){
            generateGanttChart();
        }
        else{
            fetchGanttChart();
        }
    },[]);

    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Gantt chart"} userNameLetter={currentUser.username.charAt(0).toUpperCase()}/>
                    <AnotherTry 
                        // chart={ganttChart} 
                        // currency={project.currency}
                        // projectMembers={project.members}
                        // projectStartDate={project.startdate!}
                    />
                
                <div className="bottomSectionContainer">
                </div>
            </div>
        </ThemeProvider>
    );
};

export default GanttChartPage;