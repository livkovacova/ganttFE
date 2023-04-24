import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { useEffect, useState } from "react";
import mainTheme from "../commons/mainTheme";
import { Button, responsiveFontSizes } from '@mui/material/';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import { useParams, useNavigate } from "react-router-dom";
import "./GanttChartPage.css"
import { createGanttChart, getGanttChart, uploadGanttChart } from "../../services/GanttChartService";
import { Phase } from "../commons/Phase";
import { Project } from "../commons/Projects";
import _without from "lodash/without";
import { useLocation } from "react-router-dom";
import { GanttChart } from "../commons/GanttChart";
import { GanttChartComponent } from "./GanttChartComponent";

const theme = responsiveFontSizes(mainTheme);

interface Props {
    currentUser: IUser | undefined;
}

export const GanttChartPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const newPhaseId: number = location.state.newPhaseId;
    const nexTaskId: number = location.state.nextTaskId;

    const project: Project = location.state.project;
    const currentUser: IUser = location.state.currentUser;
    const phases: Phase[] = location.state.phases;
    const alreadyCreated: boolean = location.state.alreadyCreated;
    const onlyView: boolean = location.state.onlyView;
    const [ganttChart, setGanttChart] = useState<GanttChart>();
    const [ganttSaved, setGanttSaved] = useState(false);

    const navigateToProjectDetailsPage = () => {
        navigate('/projects/' + id);
    }

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
        setGanttSaved(true);
    }

    useEffect(() => {
        console.log(alreadyCreated)
        if (!alreadyCreated) {
            generateGanttChart();
        }
        else {
            fetchGanttChart();
        }
    }, []);

    const handleDateChanges = (chart: GanttChart) => {
        setGanttChart(chart);
        console.log(chart);
    }

    const navigateToEditPhases = () => {
        navigate(`/projects/${id}/create-gantt`, {
            state: {
                isEditingGantt: true,
                savedPhases: phases,
                newPhaseId: newPhaseId,
                nextTaskId: nexTaskId
            }
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Gantt chart"} userNameLetter={currentUser.username.charAt(0).toUpperCase()} />
                {ganttChart != undefined || null ? (
                    <div className="chartWrapper">
                        <GanttChartComponent
                            chart={ganttChart!}
                            currency={project.currency}
                            projectMembers={project.members}
                            projectStartDate={project.startDate!}
                            onDateChange={handleDateChanges}
                            readonly={alreadyCreated}
                            isManager={currentUser.roles!.includes("ROLE_MANAGER")}
                        />
                    </div>
                ) :
                    undefined}

                <div className="bottomSectionContainer">
                    <div
                        className="saveGanttButtons"
                    >
                        <Button
                            sx={{ marginRight: "0.4vw" }}
                            variant="contained"
                            onClick={() => { navigateToProjectDetailsPage() }}
                            color="primary"
                        >Back to project page</Button>

                        {alreadyCreated ? undefined : (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => { navigateToEditPhases() }}
                                    color="primary"
                                    disabled={ganttSaved}
                                >BACK TO EDIT PHASES</Button>
                            </>
                        )}
                        {alreadyCreated ? undefined : (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => { saveGanttChart() }}
                                    color="primary"
                                    disabled={ganttSaved}
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