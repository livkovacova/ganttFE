import { Project } from "../commons/Projects";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, TextField as DateField, TextField, IconButton, Typography} from "@mui/material";
import React from "react";
import authService from "../../services/auth.service";
import { responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import mainTheme from "../commons/mainTheme";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import _without from "lodash/without";
import { isEqual } from "lodash";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { getAllTeamMembers } from "../../services/UserDataService";
import InputAdornment from '@mui/material/InputAdornment';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TeamMemberOption } from "../HomePage/teamMemberOption";
import { createProject, editProject } from "../../services/ProjectDataService";
import { Phase } from "../commons/Phase";
import { DEFAULT_TASK, Task } from "../commons/Task";
import DoneIcon from '@mui/icons-material/Done';
import { PredecessorOption } from "./PredecessorOption";
import AddIcon from '@mui/icons-material/Add';
import { ProjectTaskForm } from "../ProjectTaskForm/ProjectTaskForm";
import "./ProjectPhaseDialog.css"


interface Props {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    phaseToEdit: Phase;
    refreshPage: () => void;
    savedPhases: Array<Phase>;
    onSubmit: (phase:Phase) => void;
    project: Project;
}

export const ProjectPhaseDialog = ({isOpen, onClose, isEditing, phaseToEdit, refreshPage, savedPhases, onSubmit, project }: Props) => {
    const [assigneesFormOptions, setAssigneesFormOptions] = React.useState<Array<TeamMemberOption>>([]);
    const [predecessorsFormOptions, setPredecessorsFormOptions] = React.useState<Array<PredecessorOption>>([]);
    const [phaseName, setPhaseName] = React.useState<string>("");
    const [currency, setCurrency] = React.useState<string>("EUR");
    const [createdTasks, setCreatedTasks] = React.useState<Array<Task>>([]);
    const [savedTasks, setSavedTasks] = React.useState<Array<Task>>([]);
    const [refresh, setRefresh] = React.useState<boolean>(false);
    const [taskEdited, setTaskEdited] = React.useState(false);
    const [newTaskId, setNewTaskId] = React.useState(0); //pozor ked budes editovat

    const [errorPhaseName, setErrorPhaseName] = React.useState<boolean>(false);

    const handleRefresh = () => setRefresh(!refresh);

    const resetInputFields = () => {
        setPhaseName("");
    };

    const clearErrors = () => {
        setErrorPhaseName(false);
    };

    const closeForm = () => {
        clearErrors();
        resetInputFields();
        onClose();
    };

    const preparePredecessorsOptions = () => {
        let otherPhasesOptions: Array<PredecessorOption> = [];
        savedPhases.map((phase) => {
            phase.tasks.map((task) =>{
                let option: PredecessorOption = {
                    value: task.workid,
                    text: task.name
                }
                otherPhasesOptions.push(option);
            }) 
        });
        
        otherPhasesOptions.length == 0 ? setPredecessorsFormOptions([]) : setPredecessorsFormOptions(otherPhasesOptions);
    }

    const throwDuplicatesAway = (array: Array<PredecessorOption>): Array<PredecessorOption> => {
        let result: PredecessorOption[] = [];
        array.reverse().forEach((item) => {
            let found = result.some((value) => isEqual(value.value, item.value));
            if (!found) {
                result.push(item);
            }
        })
        // for (let item of array) {
        //     let found = result.some((value) => isEqual(value.value, item.value));
        //     if (!found) {
        //         result.push(item);
        //     }
        // }
        return result;
    }

    const updatePredecessorsOptions = () => {
        const thisPhaseOptions: Array<PredecessorOption> = savedTasks.map((task) => {
            let option: PredecessorOption = {
                value: task.workid,
                text: task.name
            }
            return option;
        });
        let allOptions = throwDuplicatesAway(predecessorsFormOptions.concat(thisPhaseOptions)).reverse();
        allOptions.length == 0 ? setPredecessorsFormOptions([]) : setPredecessorsFormOptions(allOptions);
        console.log("som v update:");
        console.log(predecessorsFormOptions);
    }

    const prepareAssigneesOptions = () => {
        const options = project.members.map((teamMember) => {
                let option: TeamMemberOption = {
                    value: teamMember.id,
                    text: teamMember.username
                };
                return option;
            }
        );
        if (!options){
            setAssigneesFormOptions([]);
        }
        else{
            setAssigneesFormOptions(options as Array<TeamMemberOption>);
        }
    };

    const isFormValid = () => {
        clearErrors();
        let isValid = true;
        if (phaseName.length <= 3 || phaseName.length >= 30) {
            setErrorPhaseName(true);
            isValid = false;
        }
        return isValid;
    };

    const onFormSubmit = () => {
        console.log(isFormValid());
        if (isFormValid()) {
            console.log("phase saved")
            let phase: Phase = {
                name: phaseName,
                tasks: savedTasks
            }
            console.log(savedTasks);
            onSubmit(phase);
            closeForm();
            refreshPage();
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            clearErrors();
        }
        if (!isEditing) {
            resetInputFields();
        } else {
            setPhaseName(phaseToEdit?.name);
        }
    }, [isOpen]);

    React.useEffect(() => {
        prepareAssigneesOptions();
        preparePredecessorsOptions();
        updatePredecessorsOptions();
    }, []);

    React.useEffect(() => {
        updatePredecessorsOptions();
        console.log("useefect");
    }, [savedTasks, taskEdited]);

    const removeItselfFromOptions = (taskId: number): PredecessorOption[] => {
        let updatedPredecessorsOptions = predecessorsFormOptions;
        const thisTaskOption = updatedPredecessorsOptions.find((option) => {
            return option.value === taskId;
        })
        if (thisTaskOption){
            updatedPredecessorsOptions = _without(updatedPredecessorsOptions, thisTaskOption);
        }
        console.log("REMOVED");
        return updatedPredecessorsOptions;
    }

    const renderTaskForms = (): React.ReactNode => {
        return (
            createdTasks.map((task) => (
                <ProjectTaskForm 
                    key={task.workid} 
                    onSubmit={onTaskFormSave} 
                    onDelete={onTaskFormDelete}
                    taskForAction={task} 
                    isEditing={false} 
                    refreshPage={refreshPage}
                    assigneesOptions={assigneesFormOptions}
                    predecessorsOptions={removeItselfFromOptions(task.workid)}
                    currency = {project.currency}
                    />
                )
            )
        )
    };

    const addNewTaskForm = () => {
        let newTask = {
            workid: newTaskId,
            name: "New task",
            duration: 1,
            priority: 0,
            assignees: [],
            resources: 0,
            predecessors: [],
            extendable: true
        }
        setCreatedTasks([...createdTasks, newTask]);
        setNewTaskId(newTaskId+1);
        console.log("Created: ");
        console.log(createdTasks);
        handleRefresh();
    }

    //add is Editing
    const onTaskFormSave = (task: Task, isEditing: boolean) => {
        if(isEditing){
            //podobne aj pre created tasks
            let editedTask = savedTasks.find((savedTask) => savedTask.workid == task.workid);
            editedTask = structuredClone(task);
            setSavedTasks(savedTasks);
            setTaskEdited(!taskEdited);
        }
        else{
            setSavedTasks([...savedTasks, task]);
        }
        console.log("Saved: ");
        console.log(savedTasks);
        handleRefresh();
    };

    const findPredecessor = (taskId: number): PredecessorOption => {        
        let found = predecessorsFormOptions.find((option) => option.value === taskId);
        return found!;
    }

    const onTaskFormDelete = (task: Task) => {
        setCreatedTasks((current) => _without(current, task));
        setSavedTasks((current) => _without(current, task));
        setPredecessorsFormOptions((current) => _without(current, findPredecessor(task.workid)));
        setTaskEdited(!taskEdited)
        handleRefresh();
    }

    const theme = responsiveFontSizes(mainTheme);
    
      return (
        <div>
          <Dialog 
          fullWidth 
          maxWidth="xl" 
          PaperProps={{
            sx: {
                minHeight: '90vh',
                maxHeight: '90vh'
            }
          }} 
          open={isOpen} 
          onClose={closeForm} >
            <DialogTitle>
                <TextField
                autoFocus
                margin="normal"
                id="phaseName"
                label="Phase Name"
                type="text"
                value={phaseName}
                fullWidth
                variant="standard"
                size="medium"
                InputProps={{
                    style: {fontSize: "1.5rem"}
                }}
                InputLabelProps={{
                    style: {fontSize: "1.5rem"}
                }}
                onChange={(e) => setPhaseName(e.target.value)}
              />
              {
                errorPhaseName ?
                        (<FormHelperText
                            id="phaseNameHelper"
                            error={true}>
                            Phase name should have at least 3 and max 30 letters!
                        </FormHelperText>) :
                        null
                }
            </DialogTitle>
            <DialogContent sx={{paddingBottom:"0.1vh", display:"flex", flexDirection:"column"}}>
                
                <DialogContentText>
                    <Typography variant="subtitle2">Enter informations about tasks in this phase.</Typography>
                </DialogContentText>
                <div className="tasksListContainer">
                    {renderTaskForms()}
                    <div>
                    <Button onClick={() => addNewTaskForm()} startIcon={<AddIcon/>}>
                        Add task
                    </Button>
                </div>
                </div>
              
            </DialogContent>
            <DialogActions>
              <Button onClick={closeForm} color="secondary">Cancel</Button>
              <IconButton color="primary" onClick={onFormSubmit}>
                <DoneIcon></DoneIcon>
              </IconButton>
            </DialogActions>
          </Dialog>
        </div>
      );

};