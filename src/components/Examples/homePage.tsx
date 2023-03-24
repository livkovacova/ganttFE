import { Navigate, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import "../Auth/auth.css"
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import AuthService from "../../services/auth.service";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react"
import IUser from "../../types/user.type";
import mainTheme from "../mainTheme";
import "../Examples/homePage.css"
import { getProjectsById } from "../../services/ProjectDataService";
import { Project } from "./Projects";

const theme = responsiveFontSizes(mainTheme);

const HomePage = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = React.useState<Array<Project>>([]);
    const [projectFetched, setProjectFetched] = React.useState(false);

    const fetchProjectInfo = async () => {
        // let projects: Array<Project> = [{
        //     id: 123,
        //     name: "projectName",
        //     description: "decs",
        //     manager: null,
        //     resources: 123,
        //     members: []
        // },
        // {
        //     id: 123,
        //     name: "projectName",
        //     description: "decs",
        //     manager: null,
        //     resources: 123,
        //     members: []
        // }];
        let currUser = AuthService.getCurrentUser();
        const result = await getProjectsById(currUser.id, currUser.roles[0])
        setProjects(result)
        setProjectFetched(true)
    }

    React.useEffect(() => {
        fetchProjectInfo();
    }, [projectFetched]);

    const renderProjects = (): React.ReactNode => {
        return projects?.map((project) =>
        <div className="projectsContainer">
            <div className="headingContainer">
                    <h5 className="headingStyle">{project?.name}</h5>
                </div>
                <div className="eventButtons">
                    A
                </div>
        </div>
        )
    }

    return (
        <div className="projectListContainer">
            {renderProjects()}
        </div>

    // <div>
    //   <ThemeProvider theme={theme}>
    //     <Typography variant="h3" color={"primary"}>Responsive h3</Typography>
    //     <Typography variant="h4" color={"secondary"}>Responsive h4</Typography>
    //     <Typography variant="h5" color={"white"}>Responsive h5</Typography>
    //   </ThemeProvider>
    // </div>
  );
}

export default HomePage;