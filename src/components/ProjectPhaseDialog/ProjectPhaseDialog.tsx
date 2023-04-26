import { Project } from "../commons/Projects";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormHelperText, TextField, IconButton, Typography} from "@mui/material";
import React from "react";
import { responsiveFontSizes,} from '@mui/material/styles';
import mainTheme from "../commons/mainTheme";
import _without from "lodash/without";
import { isEqual } from "lodash";
import { TeamMemberOption } from "../commons/TeamMemberOption";
import { Phase } from "../commons/Phase";
import { Task } from "../commons/Task";
import DoneIcon from '@mui/icons-material/Done';
import { PredecessorOption } from "../commons/PredecessorOption";
import AddIcon from '@mui/icons-material/Add';
import { ProjectTaskForm } from "../ProjectTaskForm/ProjectTaskForm";
import "./ProjectPhaseDialog.css"
import { PRIORITY } from "../commons/enums";


interface Props {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    phaseToEdit: Phase;
    refreshPage: () => void;
    savedPhases: Array<Phase>;
    onSubmit: (phase:Phase) => void;
    project: Project;
    nextTaskId: number;
    isEditingGantt: boolean;
    onAddTaskForm: (id: number) => void;
}

export const ProjectPhaseDialog = ({isOpen, onClose, isEditing, phaseToEdit, refreshPage, savedPhases, onSubmit, project, nextTaskId, isEditingGantt, onAddTaskForm }: Props) => {
    const [assigneesFormOptions, setAssigneesFormOptions] = React.useState<Array<TeamMemberOption>>([]);
    const [predecessorsFormOptions, setPredecessorsFormOptions] = React.useState<Array<PredecessorOption>>([]);
    const [phaseName, setPhaseName] = React.useState<string>("");
    const [createdTasks, setCreatedTasks] = React.useState<Array<Task>>([]);
    const [savedTasks, setSavedTasks] = React.useState<Array<Task>>([]);
    const [refresh, setRefresh] = React.useState<boolean>(false);
    const [taskEdited, setTaskEdited] = React.useState(false);
    const [newTaskId, setNewTaskId] = React.useState(isEditingGantt? nextTaskId : 0);

    const [errorPhaseName, setErrorPhaseName] = React.useState<boolean>(false);

    const handleRefresh = () => setRefresh(!refresh);

    const resetInputFields = () => {
        setPhaseName("");
        setCreatedTasks([]);
        setSavedTasks([]);
        setTaskEdited(false);
    };

    const clearErrors = () => {
        setErrorPhaseName(false);
    };

    const closeForm = (saved: boolean) => {
        clearErrors();
        resetInputFields();
        if(!saved){
            removePredecessorsOnClose();
        }
        onClose();
    };

    const removePredecessorsOnClose = () => {
        let optionsToRemoveIds: number[] = savedTasks.map((task) => task.workId);
        let newOptions = predecessorsFormOptions.filter((option) => !optionsToRemoveIds.includes(option.value))
        setPredecessorsFormOptions(newOptions);
    }

    const preparePredecessorsOptions = () => {
        let otherPhasesOptions: Array<PredecessorOption> = [];
        savedPhases.map((phase) => {
            phase.tasks.map((task) =>{
                let option: PredecessorOption = {
                    value: task.workId,
                    text: task.name
                }
                otherPhasesOptions.push(option);
            }) 
        });
        
        console.log(otherPhasesOptions);
        otherPhasesOptions.length == 0 ? setPredecessorsFormOptions([]) : setPredecessorsFormOptions(otherPhasesOptions);
        console.log(predecessorsFormOptions);
    }

    const throwDuplicatesAway = (array: Array<PredecessorOption>): Array<PredecessorOption> => {
        let result: PredecessorOption[] = [];
        array.reverse().forEach((item) => {
            let found = result.some((value) => isEqual(value.value, item.value));
            if (!found) {
                result.push(item);
            }
        })
        return result;
    }

    const updatePredecessorsOptions = () => {
        const thisPhaseOptions: Array<PredecessorOption> = savedTasks.map((task) => {
            let option: PredecessorOption = {
                value: task.workId,
                text: task.name
            }
            return option;
        });
        console.log(thisPhaseOptions)
        console.log(predecessorsFormOptions)
        let allOptions = throwDuplicatesAway(predecessorsFormOptions.concat(thisPhaseOptions)).reverse();
        allOptions.length == 0 ? setPredecessorsFormOptions([]) : setPredecessorsFormOptions(allOptions);
        console.log("som v update:");
        console.log(predecessorsFormOptions);
    }

    const prepareAssigneesOptions = () => {
        const options = project.members.map((teamMember) => {
                console.log(teamMember.id)
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
            console.log(options)
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
                workId: phaseToEdit.workId,
                name: phaseName,
                tasks: savedTasks
            }
            console.log(savedTasks);
            onSubmit(phase);
            closeForm(true);
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
            setPhaseName(phaseToEdit.name);
            setSavedTasks(phaseToEdit.tasks);
            setCreatedTasks(phaseToEdit.tasks);
        }
    }, [isOpen]);

    React.useEffect(() => {
        prepareAssigneesOptions();
        preparePredecessorsOptions();
        updatePredecessorsOptions();
    }, [project]);

    React.useEffect(() => {
        preparePredecessorsOptions();
    }, [savedPhases, isOpen]);

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
                    key={task.workId} 
                    onSubmit={onTaskFormSave} 
                    onDelete={onTaskFormDelete}
                    taskForAction={task} 
                    isEditing={savedTasks.some(savedTask => savedTask.workId === task.workId)} 
                    refreshPage={refreshPage}
                    assigneesOptions={assigneesFormOptions}
                    predecessorsOptions={removeItselfFromOptions(task.workId)}
                    currency = {project.currency}
                    />
                )
            )
        )
    };

    const addNewTaskForm = () => {
        let newTask = {
            workId: newTaskId,
            name: "New task",
            duration: 1,
            priority: PRIORITY.MEDIUM,
            assignees: [],
            resources: 0,
            predecessors: [],
            state: 0
        }
        setCreatedTasks([...createdTasks, newTask]);
        setNewTaskId(newTaskId+1);
        console.log(createdTasks);
        handleRefresh();
        onAddTaskForm(newTaskId+1);
    }

    //add is Editing
    const onTaskFormSave = (task: Task, isEditing: boolean) => {
        if(isEditing){
            let editedTask = savedTasks.find((savedTask) => savedTask.workId == task.workId);
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
        setPredecessorsFormOptions((current) => _without(current, findPredecessor(task.workId)));
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
              <Button onClick={() => closeForm(isEditing)} color="secondary">Cancel</Button>
              <IconButton color="primary" onClick={onFormSubmit}>
                <DoneIcon></DoneIcon>
              </IconButton>
            </DialogActions>
          </Dialog>
        </div>
      );

};