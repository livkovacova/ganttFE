import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { responsiveFontSizes } from '@mui/material/styles';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, ButtonGroup, Divider, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import "../CreateGanttChartPage/CreateGanttChartPage.css"
import { getProjectById } from "../../services/ProjectDataService";
import { DeleteForever } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { DEFAULT_PHASE, Phase } from "../commons/Phase";
import { ProjectPhaseDialog } from "../ProjectPhaseDialog/ProjectPhaseDialog";
import { DEFAULT_PROJECT, Project } from "../commons/Projects";

interface Props {
    currentUser: IUser | undefined;
}
const theme = responsiveFontSizes(mainTheme);

export const CreateGanttChartPage = ({currentUser}: Props) => {

    const {id} = useParams();
    const navigate = useNavigate();

    const [projectName, setProjectName] = useState<string>("");
    const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [savedPhases, setSavedPhases] = useState<Array<Phase>>([]);

    const [isOpenForm, setIsOpenForm] = React.useState<boolean>(false);
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [phaseToEdit, setPhaseToEdit] = React.useState<Phase>(DEFAULT_PHASE);
    const [phaseForAction, setPhaseForAction] = React.useState<Phase>({} as Phase);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    
    const onDeleteDialogClick = () => setDeleteDialogOpen(true);
    const onDeleteDialogClose = () => setDeleteDialogOpen(false);

    const handleRefresh = () => setRefresh(!refresh);

    // Create/edit event form
    const onFormClick = () => setIsOpenForm(true);
    const onFormClose = () => setIsOpenForm(false);

    const handleEditClick = (phase: Phase) => {
        setPhaseToEdit(phase);
        setIsEditing(true);
        onFormClick();
    };

    const handleEditClose = () => {
        setPhaseToEdit(DEFAULT_PHASE);
        setIsEditing(false);
        onFormClose();
    };

    const handleDialogClick = (phase: Phase) => {
        setPhaseForAction(phase);
        onDeleteDialogClick();
    };

    const onDeleteDialogConfirm = (phase: Phase) => {
        // await deleteProject(project.id);
        onDeleteDialogClose();
        setRefresh(true);
    };


    const fetchProjectInfo = async () => {
        const project = await getProjectById(parseInt(id!));
        setProject(project);
        setProjectName(project.name);
    };

    React.useEffect(() => {
        fetchProjectInfo();
    });

    const renderPhasesList = (): React.ReactNode => {
        return (
            
            <div className="phaseListContainer">
                {savedPhases?.map((phase, index) =>
                    <Accordion key={index} sx={{width:"90vw"}}>
                    <AccordionSummary
                        sx={{
                            pointerEvents: "none"
                        }}
                        expandIcon={<ExpandMoreIcon sx={{pointerEvents: "auto"}}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                      <Typography>{phase.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{padding: "0 0 0 0"}}>
                        <List dense sx={{paddingTop: "0", paddingBottom: "0"}}>
                        {phase.tasks?.map((task, index) =>
                            <ListItem key={index}>
                                <ListItemText
                                primary={task.name}
                                />
                            </ListItem>
                        )
                        }
                        </List>
                    </AccordionDetails>
                    <Divider />
                    <AccordionActions>
                        <Button size="small" color="secondary" onClick={() => alert('cancel '+{index})}>Remove</Button>
                        <Button size="small" color="primary" onClick={() => alert('save')}>Edit</Button>
                    </AccordionActions>
                  </Accordion>
                    )
                }
            </div>
        )
    }

    const onAddPhaseClick = (phase: Phase) => {
        let updatedPhases = savedPhases;
        updatedPhases.push(phase);
        setSavedPhases(updatedPhases);
        //savedPhases.push({name:"new phase", tasks:["task1", "task 2"]})
        console.log(savedPhases);
        setRefresh(!refresh);
    };

    const onSumbitAddingPhase = () => {
        console.log("Phase submited");
    }


    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={projectName + " | create Gantt chart"} userNameLetter={currentUser?.username.charAt(0).toUpperCase()}/>
                <div className="phasesContainer">
                {renderPhasesList()}
                <div className="addButton">
                    <Button onClick={() => onFormClick()} startIcon={<AddIcon/>}>
                        Add phase
                    </Button>
                </div>
                </div>
                <div className="submitButtonsContainer">
                    <ButtonGroup 
                    variant="contained" 
                    className="createGanttButtons" 
                    >
                        <Button 
                        disabled={savedPhases.length == 0} 
                        color="primary" 
                        sx={{
                            "&.Mui-disabled": {
                            background: "#eaeaea",
                            color: "#c0c0c0"
                            }
                        }}>CREATE GANTT CHART</Button>
                    </ButtonGroup>
                </div>
                <ProjectPhaseDialog
                    isOpen={isOpenForm}
                    onClose={handleEditClose}
                    isEditing={isEditing}
                    phaseToEdit={phaseToEdit}
                    refreshPage={handleRefresh}
                    savedPhases={savedPhases}
                    onSubmit={onSumbitAddingPhase}
                    project={project}
                />
            </div>
        </ThemeProvider>
    );
};

export default CreateGanttChartPage;