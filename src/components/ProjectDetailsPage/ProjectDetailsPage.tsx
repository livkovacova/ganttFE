import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { responsiveFontSizes } from '@mui/material/';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import { Button, ButtonGroup, IconButton, Tooltip } from "@mui/material/";
import "../ProjectDetailsPage/ProjectDetailsPage.css"
import { getProjectById } from "../../services/ProjectDataService";
import { Project } from "../commons/Projects";


interface Props {
    isManager: boolean;
    currentUser: IUser | undefined;
}
const theme = responsiveFontSizes(mainTheme);

export const ProjectDetailsPage = ({isManager, currentUser}: Props) => {

    const {id} = useParams();
    const navigate = useNavigate();

    const [isGanttCreated, setGanttCreated] = useState<boolean>(false);
    const [isTreeCreated, setTreeCreated] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false);
    const [project, setProject] = useState<Project>();

    const fetchProjectInfo = async () => {
        const project = await getProjectById(parseInt(id!));
        setGanttCreated(project.ganttCreated);
        setTreeCreated(project.treeCreated);
        setProjectName(project.name);
        setProject(project);
    };

    const onViewGanttChartClick = () => {
        navigate(`/projects/${id}/gantt-chart`, {
            state: {
                project: project,
                currentUser: currentUser,
                alreadyCreated: true, 
                onlyView: true
            }
        })
    }

    const onDependencyDiagramClick = (alreadyCreated: boolean) => {
        navigate(`/projects/${id}/dependency-diagram`, {
            state: {
                project: project,
                currentUser: currentUser,
                alreadyCreated: alreadyCreated, 
            }
        })
    }

    React.useEffect(() => {
        fetchProjectInfo();
    },[]);

    const renderFirstButton = (): React.ReactNode => {
        return (
            <>{isManager && !isGanttCreated? 
                (
                <Button fullWidth color="primary" onClick={() => navigate(`/projects/${id}/create-gantt`, {state: {isEditingGantt: false}})}>
                    CREATE GANTT CHART
                </Button>) 
                    :
                <Tooltip title={!isGanttCreated ? "Gantt Chart is not created yet." : null} arrow>
                    <span>
                        <Button fullWidth color="primary" disabled={!isGanttCreated} onClick={onViewGanttChartClick}>
                            VIEW GANTT CHART
                        </Button>
                    </span>
                </Tooltip>
                }
            </>
        );
    }

    const renderSecondButton = (): React.ReactNode => {
        return (
            <>{isManager && !isTreeCreated? 
                (
                <Tooltip title={!isGanttCreated ? "Create Gantt Chart first." : null} arrow>
                    <span>
                        <Button fullWidth color="primary" disabled={!isGanttCreated} onClick={() => onDependencyDiagramClick(false)}>
                            GENERATE DEPENDENCY DIAGRAM
                        </Button>
                    </span>
                </Tooltip>) 
                    :
                <Tooltip title={!isTreeCreated ? "Dependency tree is not created yet." : null} arrow>
                    <span>
                        <Button fullWidth color="primary" disabled={!isTreeCreated} onClick={() => onDependencyDiagramClick(true)}>
                            VIEW DEPENDENCY DIAGRAM
                        </Button>
                    </span>
                </Tooltip>
                }
            </>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="projectDetailsPageContainer">
                <NavigationBar withCreate={false} isManager={isManager} mainTitle={projectName} userNameLetter={currentUser?.username.charAt(0).toUpperCase()}/>
                <div className="projectDetailContainer">
                    <ButtonGroup 
                    variant="contained" 
                    className="projectDetailButtons" >
                        {renderFirstButton()}
                        {renderSecondButton()}
                    </ButtonGroup>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default ProjectDetailsPage;