import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { Button, responsiveFontSizes } from '@mui/material/';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import "./DependencyDiagramPage.css"
import { Project } from "../commons/Projects";
import { useLocation } from "react-router-dom";
import { PhaseResponse } from "../commons/Phase";
import HorizontalFlow from "../HorizontalFlowDiagram/HorizontalFlowDiagram";
import { GanttChart } from "../commons/GanttChart";
import { getGanttChart } from "../../services/GanttChartService";
import { setDependencyDiagramCreated } from "../../services/ProjectDataService";

const theme = responsiveFontSizes(mainTheme);

export const DependencyDiagramPage = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const project: Project = location.state.project;
    const currentUser: IUser = location.state.currentUser;
    const alreadyCreated: boolean = location.state.alreadyCreated;
    const [phaseResponses, setPhaseResponses] = useState<Array<PhaseResponse>>([]);

    const navigateToProjectDetailsPage = () => {
      navigate('/projects/'+id);
    }

    const fetchGanttChartPhases = async () => {
      const chart: GanttChart = await getGanttChart(project.id);
      setPhaseResponses(chart.phases);
    }

    useEffect(() => {
        fetchGanttChartPhases();
        if(currentUser.roles!.includes("ROLE_MANAGER") && !alreadyCreated){
          setDependencyDiagramCreated(project.id);
        }
    },[]);

    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Dependency diagram"} userNameLetter={currentUser.username.charAt(0).toUpperCase()}/>
                <div className="contentWrapper">
                  <div className="phasesWrapper">
                    {phaseResponses.length !== 0? (
                      <HorizontalFlow phases={phaseResponses}/>
                    ):
                    undefined}
                  </div>
                  <div className="toolBar"></div>
                </div>
                  <div className="bottomSectionContainerHere">  
                  <div
                      className="saveGanttButtons" 
                      >
                          <Button
                          sx={{marginRight: "0.4vw"}}
                          variant="contained" 
                          onClick={() => {navigateToProjectDetailsPage()}}
                          color="primary" 
                      >Back to project page</Button>
                          
                      </div>
                  </div>
                </div>
        </ThemeProvider>
    );
};

export default DependencyDiagramPage;