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
import Tree, { Phasee } from "./DependencyTry";
import { PhaseResponse } from "../commons/Phase";
import { DependencyDiagram } from "./DependencyDiagramComponent";

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
    const alreadyCreated: boolean = location.state.alreadyCreated;
    const onlyView: boolean = location.state.onlyView;
    const [dependencyDiagram, setDependencyDiagram] = useState(false);

    // const generateDependencyDiagram = async () => {
    //     const chart: GanttChart = await createDependencyChart(parseInt(id!));
    //     setDependencyDiagram(chart);
    // };

    // const fetchDependencyDiagram = async () => {
    //     const chart: GanttChart = await getDependencyChart(project.id);
    //     setDependencyDiagram(chart)
    // }

    // useEffect(() => {
    //     console.log(alreadyCreated)
    //     if(!alreadyCreated){
    //         generateDependencyDiagram();
    //     }
    //     else{
    //         fetchDependencyDiagram();
    //     }
    // },[]);

    const phases: Phasee[] = [
        {
          name: "Phase 1",
          tasks: [
            { name: "Task 1.1", completed: true },
            { name: "Task 1.2", completed: false },
          ],
          children: [
            {
              name: "Sub-Phase 1.1",
              tasks: [{ name: "Task 1.1.1", completed: true, dependencies:["Task 1.2"]}],
            },
          ],
        },
        {
          name: "Phase 2",
          tasks: [{ name: "Task 2.1", completed: false }],
          children: [
            {
              name: "Sub-Phase 2.1",
              tasks: [
                { name: "Task 2.1.1", completed: false },
                { name: "Task 2.1.2", completed: false, dependencies:["Task 2.1.1"] },
              ],
            },
            {
              name: "Sub-Phase 2.2",
              tasks: [{ name: "Task 2.2.1", completed: false, dependencies:["Task 2.1.2"] }],
            },
          ],
        },
      ];

    const phaseResponses: PhaseResponse[] = [
        {
            workId: 0,
            name: "phase 1",
            tasks: [
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 1,
            name: "phase 2",
            tasks: [
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 2,
            name: "phase 3",
            tasks: [
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 3,
            name: "phase 3",
            tasks: [
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 4,
            name: "phase 3",
            tasks: [
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 5,
            name: "phase 3",
            tasks: [
            ],
            projectId: 2,
            realId: 1
        }
    ]


    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Dependency diagram"} userNameLetter={currentUser.username.charAt(0).toUpperCase()}/>
                {dependencyDiagram != undefined || null ? (
                    <>
                    </>
                ):
                undefined}
                <DependencyDiagram phases={phaseResponses}></DependencyDiagram>
                <div className="bottomSectionContainer">
                    
                </div>
            </div>
        </ThemeProvider>
    );
                    //add mesage about saved gantt

};

export default DependencyDiagramPage;