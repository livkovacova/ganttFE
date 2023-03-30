import { Project } from "../commons/Projects";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, TextField as DateField, TextField} from "@mui/material";
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
import { TeamMemberOption } from "./teamMemberOption";
import { createProject, editProject } from "../../services/ProjectDataService";


interface Props {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    projectToEdit: Project;
    refreshPage: React.Dispatch<boolean>;
    onlyView: boolean;
}

export const ProjectForm = ({isOpen, onClose, isEditing, projectToEdit, onlyView, refreshPage}: Props) => {
    const [projectMembersFormOptions, setProjectMembersFormOptions] = React.useState<Array<TeamMemberOption>>([]);
    const [selectedProjectMembersOptions, setSelectedProjectMembersOptions] = React.useState<Array<TeamMemberOption>>([]);
    const [projectName, setProjectName] = React.useState<string>("");
    const [projectDescription, setProjectDescription] = React.useState<string>("");
    const [projectManager, setProjectManager] = React.useState<string>("");
    const [currency, setCurrency] = React.useState<string>("EUR");
    const [projectResources, setProjectResources] = React.useState<number>(0);
    const [projectStart, setProjectStart] = React.useState<Date | null>(new Date());
    
    const [errorProjectName, setErrorProjectName] = React.useState<boolean>(false);
    const [errorProjectDescription, setErrorProjectDescription] = React.useState<boolean>(false);
    const [errorProjectManager, setErrorProjectManager] = React.useState<boolean>(false);
    const [errorSelectedOptions, setErrorSelectedOptions] = React.useState<boolean>(false);
    const [errorProjectStart, setErrorProjectStart] = React.useState<boolean>(false);

    const resetInputFields = () => {
        setProjectName("");
        setSelectedProjectMembersOptions([]);
        setProjectStart(new Date());
        setProjectManager(authService.getCurrentUser().username)
        setProjectDescription("");
        setProjectResources(0);
    };

    const clearErrors = () => {
        setErrorProjectName(false);
        setErrorProjectDescription(false);
        setErrorSelectedOptions(false);
        setErrorProjectStart(false);
    };

    const closeForm = () => {
        clearErrors();
        resetInputFields();
        onClose();
    };

    const fetchUsers = async () => {
        const options = (await getAllTeamMembers())?.map((teamMember) => {
                let option: TeamMemberOption = {
                    value: teamMember.id,
                    text: teamMember.username
                };
                return option;
            }
        );
        if (!options){
            setProjectMembersFormOptions([]);
        }
        else{
            setProjectMembersFormOptions(options as Array<TeamMemberOption>);
        }
    };

    const isStartTimeOrInputInvalid = () => {
        return isNaN(projectStart!.getTime());
    };

    const areDatesInvalid = () => {
        return isStartTimeOrInputInvalid();
    };

    const isFormValid = () => {
        clearErrors();
        let isValid = true;
        if (projectName.length <= 3 || projectName.length >= 30) {
            setErrorProjectName(true);
            isValid = false;
        }
        if (projectDescription.length <= 3 || projectName.length >= 200) {
            setErrorProjectDescription(true);
            isValid = false;
        }
        if (projectManager.length === 0) {
            setErrorProjectManager(true);
            isValid = false;
        }
        if (selectedProjectMembersOptions.length === 0) {
            setErrorSelectedOptions(true);
            isValid = false;
        }
        if (!projectStart || areDatesInvalid()) {
            setErrorProjectStart(true);
            isValid = false;
        }
        return isValid;
    };

    const saveProject = async () => {
        if (!isEditing) {
            await createProject(
                projectName,
                projectDescription,
                authService.getCurrentUser().id,
                selectedProjectMembersOptions.map((member) => member.value),
                projectResources,
                projectStart? projectStart : new Date()
            );
        } else {
            await editProject(
                projectToEdit.id,
                projectName,
                projectDescription,
                authService.getCurrentUser().id,
                selectedProjectMembersOptions.map((member) => member.value),
                projectResources,
                projectStart? projectStart : new Date()
            );
        }
        closeForm();
    };

    const onFormSubmit = () => {
        console.log(isFormValid());
        if (isFormValid()) {
            console.log("project saved")
            saveProject();
            refreshPage(true);
        }
    };

    const handleChange = (event: SelectChangeEvent<typeof selectedProjectMembersOptions>) => {
        const {
          target: { value },
        } = event;
        setSelectedProjectMembersOptions(
          event.target.value as TeamMemberOption[]
        );
    };

    const handleDelete = (e: React.MouseEvent, value: TeamMemberOption) => {
        e.preventDefault();
        console.log("clicked delete");
        setSelectedProjectMembersOptions((current) => _without(current, value));
    };

    React.useEffect(() => {
        if (isOpen) {
            clearErrors();
        }
        if (!isEditing && !onlyView) {
            resetInputFields();
        } else {
            setProjectName(projectToEdit?.name);
            setProjectStart(projectToEdit.startdate? new Date(projectToEdit.startdate) : new Date());
            setProjectDescription(projectToEdit.description);
            setProjectResources(projectToEdit.resources);
            setProjectManager(projectToEdit.manager.username);
            setSelectedProjectMembersOptions(projectToEdit.members.map((user) => {
                return { 
                    value: user.id,
                    text: user.username
                }
            }));
        }
    }, [isOpen]);

    React.useEffect(() => {
        let currentUserFromAuth = authService.getCurrentUser();
        setProjectManager(currentUserFromAuth.username);
        fetchUsers();
    }, []);

    const theme = responsiveFontSizes(mainTheme);
    
      return (
        <div>
          <Dialog fullWidth open={isOpen} onClose={closeForm} >
            
            <DialogTitle>{isEditing ? "Edit project" : !onlyView ? "New project" : projectName}</DialogTitle>
            <DialogContent sx={{paddingBottom:"0.1vh", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                {!onlyView ? 
                (
                    <DialogContentText>
                        Enter informations about project.
                    </DialogContentText>
                ) :
                null
                }
              <TextField
                autoFocus
                margin="normal"
                id="projectName"
                label="Name"
                type="text"
                value={projectName}
                InputProps={{
                    readOnly: onlyView,
                }}
                fullWidth
                variant="standard"
                onChange={(e) => setProjectName(e.target.value)}
              />
              {
                errorProjectName ?
                        (<FormHelperText
                            id="projectNameHelper"
                            error={true}>
                            Project name should have at least 3 and max 30 letters!
                        </FormHelperText>) :
                        null
                }
              <TextField
                autoFocus
                multiline
                margin="normal"
                id="projectDescription"
                label="Description"
                type="text"
                value={projectDescription}
                InputProps={{
                    readOnly: onlyView,
                }}
                fullWidth
                variant="standard"
                onChange={(e) => setProjectDescription(e.target.value)}
              />
              {
                errorProjectDescription ?
                        (<FormHelperText
                            id="projectDescriptionHelper"
                            error={true}>
                            Project name should have at least 3 and max 200 letters!
                        </FormHelperText>) :
                        null
                }
                <TextField
                    id="outlined-read-only-input"
                    label="Manager"
                    margin="normal"
                    defaultValue={projectManager}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <FormControl fullWidth margin="normal">
                <InputLabel id="mutiple-chip-label">Team Members</InputLabel>
                <Select
                    labelId="mutiple-chip-label"
                    label="Team Members"
                    id="mutiple-chip"
                    multiple
                    variant="outlined"
                    readOnly={isEditing || onlyView}
                    value={selectedProjectMembersOptions}
                    onChange={handleChange}
                    IconComponent={KeyboardArrowDownIcon}
                    renderValue={(selected) => (
                    <div style={{display:"flex", flexWrap:"wrap"}}>
                        {(selected as TeamMemberOption[]).map((value) => (
                        <Chip
                            key={value.value}
                            label={value.text}
                            clickable
                            deleteIcon={
                            <CancelIcon
                                onMouseDown={(event) => event.stopPropagation()}
                            />
                            }
                            onDelete={(e) => {handleDelete(e, value)}}
                            onClick={() => console.log("clicked chip")}
                            style={{margin: 2}}
                        />
                        ))}
                    </div>
                    )}
                >
            {projectMembersFormOptions.map((user) => (
                //@ts-ignore
              <MenuItem key={user.value} value={user}>
                <Checkbox readOnly={isEditing} checked={selectedProjectMembersOptions.includes(user)} />
                <ListItemText primary={user.text} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
            label="Start date"
            value={projectStart}
            readOnly={isEditing || onlyView}
            onChange={(newStart) => setProjectStart(newStart)}
            sx={{marginTop:"2vh"}}
        />
        </LocalizationProvider>
        <TextField
            fullWidth
            autoFocus
            margin="normal"
            type="number"
            value={projectResources.toString(10)}
            onChange={(e) => setProjectResources(parseInt(e.target.value))}
            label="Resources"
            id="resources"
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                endAdornment: <InputAdornment position="end">
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currency}
                                    label="currency"
                                    variant="standard"
                                    readOnly={onlyView}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <MenuItem value={"EUR"}>€</MenuItem>
                                    <MenuItem value={"DOLARS"}>$</MenuItem>
                                </Select>
                            </InputAdornment>,
                inputProps: { 
                    min: 0 
                },
                readOnly: onlyView
          }}
          variant="standard"
        />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeForm} color="secondary">Cancel</Button>
              {!onlyView ? 
              (<Button onClick={onFormSubmit} variant="contained">Save project</Button>)
              :
              null
              }
            </DialogActions>
          </Dialog>
        </div>
      );

};