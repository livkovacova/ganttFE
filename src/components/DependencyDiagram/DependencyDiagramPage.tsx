import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { Button, ButtonGroup, responsiveFontSizes } from '@mui/material/';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import "./DependencyDiagramPage.css"
import { Project } from "../commons/Projects";
import _without from "lodash/without";
import { useLocation } from "react-router-dom";
import { PhaseResponse } from "../commons/Phase";
import HorizontalFlow from "../commons/FlowExample";
import { PRIORITY } from "../commons/enums";
import { GanttChart } from "../commons/GanttChart";
import { getGanttChart } from "../../services/GanttChartService";
import { setDependencyDiagramCreated } from "../../services/ProjectDataService";

const theme = responsiveFontSizes(mainTheme);

interface Props {
    currentUser: IUser | undefined;
}

export const DependencyDiagramPage = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const project: Project = location.state.project;
    const currentUser: IUser = location.state.currentUser;
    const onlyView: boolean = location.state.onlyView;
    const [phaseResponses, setPhaseResponses] = useState<Array<PhaseResponse>>([]);

    const fetchGanttChartPhases = async () => {
      const chart: GanttChart = await getGanttChart(project.id);
      setPhaseResponses(chart.phases);
    }

    useEffect(() => {
        fetchGanttChartPhases();
        if(currentUser.roles!.includes("ROLE_MANAGER")){
          setDependencyDiagramCreated(project.id);
        }
    },[]);

      const phaseResponsew: PhaseResponse[] = [
        {
            workId: 0,
            name: "phase 1",
            tasks: [
                {
                    workId: 0,
                    name: "T0",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 1,
                    name: "T1",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 2,
                    name: "T2",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [1, 0],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                }
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 1,
            name: "phase 2",
            tasks: [
                {
                    workId: 9,
                    name: "T9",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [1,0],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 3,
                    name: "T3",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [9],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 10,
                    name: "T10",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [9],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 12,
                    name: "T12",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [9],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                }
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 2,
            name: "phase 3",
            tasks: [
                {
                    workId: 4,
                    name: "T4",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [3],
                    assignees: [2],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 11,
                    name: "T11",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [3],
                    assignees: [2],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                }
            ],
            projectId: 2,
            realId: 1
        },
        
    ]


    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Dependency diagram"} userNameLetter={currentUser.username.charAt(0).toUpperCase()}/>
                <div className="phasesWrapper">
                  {phaseResponses.length != 0? (
                    <HorizontalFlow phases={phaseResponses}/>
                  ):
                  undefined}
                </div>
                <div className="bottomSectionContainer">  
                </div>
            </div>
        </ThemeProvider>
    );
};

export default DependencyDiagramPage;