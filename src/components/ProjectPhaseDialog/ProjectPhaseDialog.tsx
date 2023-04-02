import { Project } from "../commons/Projects";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, TextField as DateField, TextField, IconButton} from "@mui/material";
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
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { getAllTeamMembers } from "../../services/UserDataService";
import InputAdornment from '@mui/material/InputAdornment';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TeamMemberOption } from "../HomePage/teamMemberOption";
import { createProject, editProject } from "../../services/ProjectDataService";
import { Phase } from "../commons/Phase";
import { Task } from "../commons/Task";
import DoneIcon from '@mui/icons-material/Done';
import { PredecessorOption } from "./PredecessorOption";


interface Props {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    phaseToEdit: Phase;
    refreshPage: () => void;
    savedPhases: Array<Phase>;
    onSubmit: () => void;
    project: Project;
}

export const ProjectPhaseDialog = ({isOpen, onClose, isEditing, phaseToEdit, refreshPage, savedPhases, onSubmit, project }: Props) => {
    const [assigneesFormOptions, setAssigneesFormOptions] = React.useState<Array<TeamMemberOption>>([]);
    const [predecessorsFormOptions, setPredecessorsFormOptions] = React.useState<Array<PredecessorOption>>([]);
    const [phaseName, setPhaseName] = React.useState<string>("");
    const [currency, setCurrency] = React.useState<string>("EUR");
    const [createdTasks, setCreatedTasks] = React.useState<Array<Task>>([]);
    

    const [errorPhaseName, setErrorPhaseName] = React.useState<boolean>(false);


    const resetInputFields = () => {
        setPhaseName("");
    };

    const clearErrors = () => {
        setErrorPhaseName(false);
        // setErrorProjectDescription(false);
        // setErrorSelectedOptions(false);
        // setErrorProjectStart(false);
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

    const updatePredecessorsOptions = () => {
        const thisPhaseOptions: Array<PredecessorOption> = createdTasks.map((task) => {
            let option: PredecessorOption = {
                value: task.workid,
                text: task.name
            }
            return option;
        });
        let allOptions = predecessorsFormOptions.concat(thisPhaseOptions);
        allOptions.length == 0 ? setPredecessorsFormOptions([]) : setPredecessorsFormOptions(allOptions);
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
            //create Phase from tasks and name and pass as param
            onSubmit();
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
    }, [createdTasks]);

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
                label="Name"
                type="text"
                value={phaseName}
                fullWidth
                variant="standard"
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
            <DialogContent sx={{paddingBottom:"0.1vh", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                
                <DialogContentText>
                    Enter informations about tasks in this phase.
                </DialogContentText>
              
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