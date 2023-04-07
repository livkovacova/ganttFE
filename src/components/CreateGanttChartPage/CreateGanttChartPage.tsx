import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { responsiveFontSizes } from '@mui/material/styles';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, ButtonGroup, Dialog, DialogActions, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import "../CreateGanttChartPage/CreateGanttChartPage.css"
import { getProjectById } from "../../services/ProjectDataService";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { DEFAULT_PHASE, Phase } from "../commons/Phase";
import { ProjectPhaseDialog } from "../ProjectPhaseDialog/ProjectPhaseDialog";
import { DEFAULT_PROJECT, Project } from "../commons/Projects";
import _without from "lodash/without";


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
    const [newPhaseId, setNewPhaseId] = React.useState(0);
    
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

    const handleAddNewPhaseClick = () => {
        let newPhaseToEdit = DEFAULT_PHASE;
        newPhaseToEdit.workId = newPhaseId;
        setPhaseToEdit(newPhaseToEdit);
        onFormClick();
    }

    const handleDeleteDialogClick = (phase: Phase) => {
        setPhaseToEdit(phase);
        onDeleteDialogClick();
    };

    const onDeleteDialogConfirm = (phase: Phase) => {
        setSavedPhases((current) => _without(current, phase));
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
    },[]);

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
                        <Button size="small" color="secondary" onClick={() => handleDeleteDialogClick(phase)}>Remove</Button>
                        <Button size="small" color="primary" onClick={() => handleEditClick(phase)}>Edit</Button>
                    </AccordionActions>
                  </Accordion>
                    )
                }
            </div>
        )
    }

    const onAddPhaseSubmit = (phase: Phase) => {
        console.log(phase);
        console.log(isEditing);
        if(!isEditing){
            setSavedPhases([...savedPhases, phase]);
            setNewPhaseId(newPhaseId+1);
        }
        else{
            //let editedPhase = savedPhases.find((savedPhase) => savedPhase.workId === phase.workId);
            let editedPhases = savedPhases.map(savedPhase => savedPhase.workId === phase.workId? phase : savedPhase)
            setSavedPhases(editedPhases);
            setIsEditing(false);
        }
        console.log(savedPhases);
        setRefresh(!refresh);
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={projectName + " | create Gantt chart"} userNameLetter={currentUser?.username.charAt(0).toUpperCase()}/>
                <div className="phasesContainer">
                {renderPhasesList()}
                <div className="addButton">
                    <Button onClick={() => handleAddNewPhaseClick()} startIcon={<AddIcon/>}>
                        Add phase
                    </Button>
                </div>
                <Dialog open={isDeleteDialogOpen} onClose={onDeleteDialogClose}>
                    <DialogTitle>
                        Are you sure you want to delete "{phaseToEdit.name}" phase?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={onDeleteDialogClose} color="secondary">Cancel</Button>
                        <Button onClick={() => onDeleteDialogConfirm(phaseToEdit)} color="warning" variant="contained">Delete</Button>
                    </DialogActions>
                </Dialog>
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
                    onSubmit={onAddPhaseSubmit}
                    project={project}
                />
            </div>
        </ThemeProvider>
    );
};

export default CreateGanttChartPage;