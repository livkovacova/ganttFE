import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { Button, ButtonGroup, responsiveFontSizes } from '@mui/material/';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import "./GanttChartPage.css"
import { createGanttChart, getGanttChart, uploadGanttChart } from "../../services/GanttChartService";
import { Phase } from "../commons/Phase";
import { Project } from "../commons/Projects";
import _without from "lodash/without";
import { useLocation } from "react-router-dom";
import { DEFAULT_CHART, GanttChart } from "../commons/GanttChart";
import { GanttChartComponent } from "./GanttChartComponent";
import { AnotherTry } from "./GnattChartV2";

const theme = responsiveFontSizes(mainTheme);

interface Props {
    currentUser: IUser | undefined;
}

export const GanttChartPage = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const project: Project = location.state.project;
    const currentUser: IUser = location.state.currentUser;
    const phases: Phase[] = location.state.phases;
    const alreadyCreated: boolean = location.state.alreadyCreated;
    const onlyView: boolean = location.state.onlyView;
    const [ganttChart, setGanttChart] = useState<GanttChart>();

    const generateGanttChart = async () => {
        const chart: GanttChart = await createGanttChart(parseInt(id!), phases);
        setGanttChart(chart);
    };

    const fetchGanttChart = async () => {
        const chart: GanttChart = await getGanttChart(project.id);
        setGanttChart(chart)
    }

    const saveGanttChart = async () => {
        await uploadGanttChart(ganttChart!);
        console.log("gantt saved");
        //refreshPage
    }

    useEffect(() => {
        console.log(alreadyCreated)
        if(!alreadyCreated){
            generateGanttChart();
        }
        else{
            fetchGanttChart();
        }
    },[]);

    const handleDateChanges = (chart: GanttChart) => {
        setGanttChart(chart);
        console.log(chart);
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Gantt chart"} userNameLetter={currentUser.username.charAt(0).toUpperCase()}/>
                {ganttChart != undefined || null ? (
                    <>
                    <AnotherTry 
                        chart={ganttChart!} 
                        currency={project.currency}
                        projectMembers={project.members}
                        projectStartDate={project.startdate!}
                        onDateChange={handleDateChanges}
                        readonly={alreadyCreated}
                    />
                    </>
                ):
                undefined}
                    
                <div className="bottomSectionContainer">
                    <div
                    className="saveGanttButtons" 
                    >
                        <Button
                        sx={{marginRight: "0.4vw"}}
                        variant="contained" 
                        onClick={() => {console.log("beck to edit phases")}}
                        color="secondary" 
                    >Back to edit project phases</Button>
                        {alreadyCreated? undefined : (
                            <>
                                <Button 
                                variant="contained" 
                                onClick={() => {saveGanttChart()}}
                                color="primary" 
                                >Save GANTT CHART</Button>
                            </>
                        )}
                        
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
                    //add mesage about saved gantt

};

export default GanttChartPage;