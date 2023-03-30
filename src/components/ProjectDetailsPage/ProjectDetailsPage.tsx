import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { responsiveFontSizes } from '@mui/material/styles';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import { Button, ButtonGroup, IconButton, Tooltip } from "@mui/material";
import "../ProjectDetailsPage/ProjectDetailsPage.css"


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
    const [refresh, setRefresh] = useState<boolean>(false);

    const renderFirstButton = (): React.ReactNode => {
        return (
            <>{isManager && !isGanttCreated? 
                (
                <Button fullWidth color="primary" onClick={() => navigate(`/projects/${id}`)}>
                    CREATE GANTT CHART
                </Button>) 
                    :
                <Tooltip title={!isGanttCreated ? "Gantt Chart is not created yet." : null} arrow>
                    <span>
                        <Button fullWidth color="primary" disabled={!isGanttCreated} onClick={() => navigate(`/projects/${id}`)}>
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
                        <Button fullWidth color="primary" disabled={!isGanttCreated} onClick={() => console.log("handleGenerateTreeClick()")}>
                            GENERATE DEPENDENCY TREE
                        </Button>
                    </span>
                </Tooltip>) 
                    :
                <Tooltip title={!isTreeCreated ? "Dependency tree is not created yet." : null} arrow>
                    <span>
                        <Button fullWidth color="primary" disabled={!isTreeCreated} onClick={() => navigate(`/projects/${id}`)}>
                            VIEW DEPENDENCY TREE
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
                <NavigationBar withCreate={false} isManager={isManager} mainTitle="Project detail" userNameLetter={currentUser?.username.charAt(0).toUpperCase()}/>
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