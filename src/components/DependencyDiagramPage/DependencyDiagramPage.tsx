import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, { useEffect, useState } from "react";
import mainTheme from "../commons/mainTheme";
import { Button, responsiveFontSizes } from '@mui/material/';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import { useParams, useNavigate } from "react-router-dom";
import "./DependencyDiagramPage.css"
import { Project } from "../commons/Projects";
import { useLocation } from "react-router-dom";
import { PhaseResponse } from "../commons/Phase";
import HorizontalFlow from "../HorizontalFlowDiagram/HorizontalFlowDiagram";
import { GanttChart } from "../commons/GanttChart";
import { getGanttChart } from "../../services/GanttChartService";
import { setDependencyDiagramCreated } from "../../services/ProjectDataService";
import ToolBar from "./ToolBar";

const theme = responsiveFontSizes(mainTheme);

export const DependencyDiagramPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const project: Project = location.state.project;
  const currentUser: IUser = location.state.currentUser;
  const alreadyCreated: boolean = location.state.alreadyCreated;
  const [phaseResponses, setPhaseResponses] = useState<Array<PhaseResponse>>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<Array<string>>([]);
  const [phaseOptions, setPhaseOptions] = useState<Array<string>>([]);
  const [selectedAssigneeOptions, setSelectedAssigneeOptions] = useState<Array<string>>([]);
  const [selectedPhaseOptions, setSelectedPhaseOptions] = useState<Array<string>>([]);
  const [selectedStateOptions, setSelectedStateOptions] = useState<Array<string>>([]);

  const navigateToProjectDetailsPage = () => {
    navigate('/projects/' + id);
  }

  const fetchGanttChartPhases = async () => {
    const chart: GanttChart = await getGanttChart(project.id);
    setPhaseResponses(chart.phases);
    setPhaseOptions(chart.phases.map(phase => phase.name));
    setAssigneeOptions(project.members.map(member => member.username));
    setSelectedPhaseOptions(chart.phases.map(phase => phase.name));
    setSelectedAssigneeOptions(project.members.map(member => member.username));
    setSelectedStateOptions(["not started", "in progress", "done"]);
  }

  useEffect(() => {
    fetchGanttChartPhases();
    if (currentUser.roles!.includes("ROLE_MANAGER") && !alreadyCreated) {
      setDependencyDiagramCreated(project.id);
    }
  }, []);

  const setSelectedOptions = (phaseMap: Map<string, boolean>, assigneesMap: Map<string,boolean>, stateMap: Map<string,boolean>) => {
    const selectedPhasesFromMap: string[] = [];
    phaseMap.forEach((value,key) => {
      if(value){
        selectedPhasesFromMap.push(key);
      }
    })
    const selectedAssigneesFromMap: string[] = [];
    assigneesMap.forEach((value,key) => {
      if(value){
        selectedAssigneesFromMap.push(key);
      }
    })
    const selectedStatesFromMap: string[] = [];
    stateMap.forEach((value,key) => {
      if(value){
        selectedStatesFromMap.push(key);
      }
    })
    setSelectedPhaseOptions(selectedPhasesFromMap);
    setSelectedAssigneeOptions(selectedAssigneesFromMap);
    setSelectedStateOptions(selectedStatesFromMap);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="pageContainer">
        <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Dependency diagram"} userNameLetter={currentUser.username.charAt(0).toUpperCase()} />
        <div className="contentWrapper">
          <div className="phasesWrapper">
            {phaseResponses.length !== 0 && phaseOptions.length !== 0 && assigneeOptions.length !== 0 ? (
              <HorizontalFlow 
                phases={phaseResponses} 
                teamMembers={project.members} 
                selectedPhases={selectedPhaseOptions}
                selectedAssignees={selectedAssigneeOptions}
                selectedStates={selectedStateOptions}
                />
            ) :
              undefined}
          </div>
          <div className="toolBar">
          {phaseResponses.length !== 0 && assigneeOptions.length !== 0 && phaseOptions.length !== 0 ? (
          <div className="toolBar">
            <ToolBar phases={phaseOptions} assignees={assigneeOptions} handleFilterChange={setSelectedOptions}></ToolBar>
          </div>
          ) :
          undefined}
          </div>
        </div>
        <div className="bottomSectionContainerHere">
          <div
            className="saveGanttButtons"
          >
            <Button
              sx={{ marginRight: "0.4vw" }}
              variant="contained"
              onClick={() => { navigateToProjectDetailsPage() }}
              color="primary"
            >Back to project page</Button>

          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DependencyDiagramPage;