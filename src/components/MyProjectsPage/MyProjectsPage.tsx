import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import "../commons/auth.css"
import { responsiveFontSizes } from '@mui/material/styles';

import AuthService from "../../services/AuthService";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react"
import mainTheme from "../commons/mainTheme";
import "./MyProjectsPage.css"
import { deleteProject, getPageOfProjects } from "../../services/ProjectDataService";
import { DEFAULT_PROJECT, Project } from "../commons/Projects";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import TablePagination from '@mui/material/TablePagination';
import { ProjectForm } from "./ProjectForm";
import { ButtonGroup, IconButton, Typography } from "@mui/material";
import { DeleteForever, ChevronRight } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import InfoIcon from '@mui/icons-material/Info';

const theme = responsiveFontSizes(mainTheme);

interface Props {
    isManager: boolean;
}

const HomePage = ({isManager}: Props) => {
    const navigate = useNavigate();

    const [projects, setProjects] = React.useState<Array<Project>>([]);
    const [projectFetched, setProjectFetched] = React.useState(false);
    const [userName, setUsername] = React.useState<string>("");

    const [isOpenForm, setIsOpenForm] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [onlyView, setOnlyView] = React.useState<boolean>(false);
    const [projectToEdit, setProjectToEdit] = React.useState<Project>(DEFAULT_PROJECT);
    
    const [total, setTotal] = React.useState<number>(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [refresh, setRefresh] = React.useState<boolean>(false);

    const [projectForAction, setProjectForAction] = React.useState<Project>({} as Project);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const onDeleteDialogClick = () => setDeleteDialogOpen(true);
    const onDeleteDialogClose = () => setDeleteDialogOpen(false);

    const handleRefresh = () => setRefresh(!refresh);

    // Create/edit event form
    const onFormClick = () => setIsOpenForm(true);
    const onFormClose = () => setIsOpenForm(false);

    const handleEditClose = () => {
        setProjectToEdit(DEFAULT_PROJECT);
        setIsEditing(false);
        setOnlyView(false);
        onFormClose();
    };

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

    const handleDeleteDialogClick = (project: Project) => {
        setProjectForAction(project);
        onDeleteDialogClick();
    };

    const onDeleteDialogConfirm = async (project: Project): Promise<void> => {
        await deleteProject(project.id);
        onDeleteDialogClose();
        setRefresh(true);
    };

    const handleEditClick = (project: Project) => {
        setProjectToEdit(project);
        setIsEditing(true);
        onFormClick();
    };

    const handleViewClick = (project: Project) => {
        setProjectToEdit(project);
        setOnlyView(true);
        onFormClick();
    };

    const fetchProjectInfoPaged = async () => {
        let currUser = AuthService.getCurrentUser();
        const result = await getPageOfProjects(currUser.id, currUser.roles[0], page, rowsPerPage);
        setProjects(result.pageData);
        setTotal(result.totalItems);
    };

    React.useEffect(() => {
        let currentUserFromAuth = AuthService.getCurrentUser();
        setUsername(currentUserFromAuth.username);
    },[]);

    React.useEffect(() => {
        fetchProjectInfoPaged();
    }, [page, rowsPerPage, refresh, projectFetched]);

    const getProjectStartData = (project: Project):string | undefined=> {
        let starDate = new Date(project?.startDate!);
        return starDate.toLocaleDateString("sk-SK");
    }

    const renderProjects = (): React.ReactNode => {
        return (
            <div className="projectListContainer">
                {projects?.map((project) =>
                    <div key={project.id} className="projectsContainer">
                        <div className="headingContainer">
                            <h5 className="headingStyle">{project?.name}</h5>
                            <div className="projectInfo" style={{marginTop: "0.5vw", display: "flex", flexDirection: "row"}}>
                            <Typography variant="body2" sx={{marginRight:"0.7vh"}}>{"start date: "+ getProjectStartData(project)+ " |"}</Typography>
                            <Typography variant="body2" sx={{marginRight:"0.7vh"}}>{"team members: "+ project.members.length+ " | "}</Typography>
                            <Typography variant="body2" sx={{marginRight:"0.7vh"}}>{"tasks: "+ project.ganttChartInfo?.numberOfTasks + " |"}</Typography>
                            <Typography variant="body2" sx={{marginRight:"0.7vh"}}>{"phases: "+ project.ganttChartInfo?.numberOfPhases}</Typography>
                            </div>
                        </div>
                        <ButtonGroup className="projectButtons">
                            {isManager ?
                                (<>
                                    <IconButton onClick={() => handleDeleteDialogClick(project)} className="deleteButton">
                                        <DeleteForever></DeleteForever>
                                    </IconButton>
                                    <IconButton onClick={() => handleEditClick(project)}>
                                        <EditIcon></EditIcon>
                                    </IconButton>                     
                                </>)
                                    :
                                    (<>
                                        <IconButton onClick={() => handleViewClick(project)}>
                                            <InfoIcon></InfoIcon>
                                        </IconButton>                     
                                    </>)
                            }
                            <IconButton onClick={() => navigate(`/projects/${project?.id}`)}>
                                <ChevronRight></ChevronRight>
                            </IconButton>
                        </ButtonGroup>
                    </div>
                    )
                }
            </div>
        )
    }

    return (
        <ThemeProvider theme={theme}>
        <div className="projectsPageContainer">
            <NavigationBar onClick={onFormClick} isManager={isManager} mainTitle="My projects" withCreate={true} userNameLetter={userName.charAt(0).toUpperCase()}/>
            {renderProjects()}
            <Dialog open={isDeleteDialogOpen} onClose={onDeleteDialogClose}>
                 <DialogTitle>
                 <Typography variant="body1">Are you sure you want to delete "{projectForAction.name}" project?</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={onDeleteDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={() => onDeleteDialogConfirm(projectForAction)} color="warning" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
            <div className="TablePagination">
                <div className="projectPaginationContainer">
                    <TablePagination
                        component={"div"}
                        count={total}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            color:"lightgrey",
                            '& .MuiTablePagination-selectLabel ': {
                                margin: 0
                                },
                            '& .MuiTablePagination-displayedRows ': {
                                margin: 0
                                },
                            '& .MuiIconButton-root.Mui-disabled ': {
                                    color: "darkgray"
                                },
                            '& .MuiSelect-icon ': {
                                    color: "#B03066"
                            },
                    }}
                    />
                </div>
            </div>
            <ProjectForm
                isOpen={isOpenForm}
                onClose={handleEditClose}
                isEditing={isEditing}
                projectToEdit={projectToEdit}
                refreshPage={handleRefresh}
                onlyView={onlyView}
            />
        </div>
        </ThemeProvider>

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