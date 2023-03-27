import { Navigate, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import "../commons/auth.css"
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import AuthService from "../../services/auth.service";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react"
import IUser from "../../types/user.type";
import mainTheme from "../commons/mainTheme";
import "../HomePage/homePage.css"
import { getPageOfProjects, getProjectsById } from "../../services/ProjectDataService";
import { Project } from "../commons/Projects";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import TablePagination from '@mui/material/TablePagination';

const theme = responsiveFontSizes(mainTheme);

const HomePage = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = React.useState<Array<Project>>([]);
    const [projectFetched, setProjectFetched] = React.useState(false);
    const [isOpenForm, setIsOpenForm] = React.useState<boolean>(false);
    const [userName, setUsername] = React.useState<string>("");
    const [total, setTotal] = React.useState<number>(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onFormClick = () => setIsOpenForm(true);

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

    const fetchProjectInfoPaged = async () => {
        let currUser = AuthService.getCurrentUser();
        const result = await getPageOfProjects(currUser.id, currUser.roles[0], page, rowsPerPage);
        setProjects(result.pageData);
        setTotal(result.totalItems);
    };

    React.useEffect(() => {
        let currentUserFromAuth = AuthService.getCurrentUser();
        setUsername(currentUserFromAuth.username);
    });

    React.useEffect(() => {
        fetchProjectInfo();
    }, [projectFetched]);

    React.useEffect(() => {
        fetchProjectInfoPaged();
    }, [projectFetched]);

    React.useEffect(() => {
        fetchProjectInfoPaged();
    }, [page, rowsPerPage]);

    const renderProjects = (): React.ReactNode => {
        return (
            <div className="projectListContainer">
                <NavigationBar onClick={onFormClick} userNameLetter={userName.charAt(0).toUpperCase()}/>
                {projects?.map((project) =>
                    <div key={project.id} className="projectsContainer">
                        <div className="headingContainer">
                            <h5 className="headingStyle">{project?.name}</h5>
                        </div>
                        <div className="eventButtons">
                            A
                        </div>
                    </div>
                    )
                }
            </div>
        )
    }

    return (
        <div className="projectsPageContainer">
            {renderProjects()}
            <div className="TablePagination">
                <div className="projectPaginationContainer">
                    <TablePagination
                        component={"div"}
                        count={total}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
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