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
import { TeamMemberOption } from "./teamMemberOption";
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import _without from "lodash/without";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { getAllTeamMembers } from "../../services/UserDataService";
import InputAdornment from '@mui/material/InputAdornment';



interface Props {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    projectToEdit: Project;
    refreshPage: React.Dispatch<boolean>;
}

export const ProjectForm = ({isOpen, onClose, isEditing, projectToEdit, refreshPage}: Props) => {
    const [projectMembersFormOptions, setProjectMembersFormOptions] = React.useState<Array<string>>([]);
    const [selectedProjectMembersOptions, setSelectedProjectMembersOptions] = React.useState<Array<string>>([]);
    const [projectName, setProjectName] = React.useState<string>("");
    const [projectDescription, setProjectDescription] = React.useState<string>("");
    const [projectManager, setProjectManager] = React.useState<string>("");
    const [currency, setCurrency] = React.useState<string>("");
    const [projectResources, setProjectResources] = React.useState<number>(0);
    const [projectStart, setProjectStart] = React.useState<Date | null>(new Date());
    
    const [errorProjectName, setErrorProjectName] = React.useState<boolean>(false);
    const [errorProjectDescription, setErrorProjectDescription] = React.useState<boolean>(false);
    const [errorProjectManager, setErrorProjectManager] = React.useState<boolean>(false);
    const [errorSelectedOptions, setErrorSelectedOptions] = React.useState<boolean>(false);
    const [errorProjectStart, setErrorProjectStart] = React.useState<boolean>(false);

    const resetInputFields = () => {
        setProjectName("");
        // setSelectedProjectMembersOptions([]);
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
                return teamMember.username;
            }
        );
        if (!options){
            setProjectMembersFormOptions([]);
        }
        else{
            setProjectMembersFormOptions(options as Array<string>);
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
        // if (projectManager.length === 0) {
        //     setErrorProjectManager(true);
        //     isValid = false;
        // }
        // // if (selectedProjectMembersOptions.length === 0) {
        // //     setErrorSelectedOptions(true);
        // //     isValid = false;
        // // }
        // if (!projectStart || areDatesInvalid()) {
        //     setErrorProjectStart(true);
        //     isValid = false;
        // }
        return isValid;
    };

    // const saveEvent = async () => {
    //     if (!isEditing) {
    //         await createEvent(
    //             projectName,
    //             startInstantly ? EVENT_STATE.ACTIVE : EVENT_STATE.PLANNED,
    //             parseInt(selectedProjectMembersOptions[0].value, 10),
    //             projectStart,
    //             eventEnd
    //         );
    //     } else {
    //         const userGroup = await getUserGroup(parseInt(selectedProjectMembersOptions[0].value, 10));
    //         await editEvent(
    //             eventToEdit.id,
    //             startInstantly ? EVENT_STATE.ACTIVE : eventToEdit.eventState,
    //             projectName,
    //             userGroup,
    //             projectStart,
    //             eventEnd
    //         );
    //     }
    //     closeForm();
    //     refreshPage(true);
    // };

    // const onChangeCheckbox = () => {
    //     setStartInstantly(!startInstantly);
    //     setProjectStart(new Date());
    //     if(isEditing && startInstantly){
    //         setProjectStart(new Date(eventToEdit?.startDate));
    //     }
    // };

    const onFormSubmit = () => {
        console.log(isFormValid());
        if (isFormValid()) {
            console.log("project saved")
            // saveEvent();
        }
    };

    const handleChange = (event: SelectChangeEvent<typeof selectedProjectMembersOptions>) => {
        const {
          target: { value },
        } = event;
        setSelectedProjectMembersOptions(
          // On autofill we get a stringified value.
          event.target.value as string[]
        );
    };

    const handleDelete = (e: React.MouseEvent, value: string) => {
        e.preventDefault();
        console.log("clicked delete");
        setSelectedProjectMembersOptions((current) => _without(current, value));
    };

    // fetch userGroups when form is opened, reset form fields when creating new event
    // React.useEffect(() => {
    //     if (isOpen) {
    //         clearErrors();
    //     }
    //     if (!isEditing) {
    //         resetInputFields();
    //     } else {
    //         setProjectName(eventToEdit?.eventTitle);
    //         setProjectStart(new Date(eventToEdit?.startDate));
    //         setSelectedProjectMembersOptions([{
    //             value: projectToEdit?.userGroup.id.toString(10),
    //             text: projectToEdit?.members.
    //         }]);
    //     }
    // }, [isOpen]);

    React.useEffect(() => {
        let currentUserFromAuth = authService.getCurrentUser();
        setProjectManager(currentUserFromAuth.username);
        fetchUsers();
    }, []);

    const theme = responsiveFontSizes(mainTheme);
    
      return (
        <div>
          <Dialog fullWidth open={isOpen} onClose={closeForm} >
            
            <DialogTitle>{isEditing ? "Edit project" : "New project"}</DialogTitle>
            <DialogContent sx={{paddingBottom:"0.1vh", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
              <DialogContentText>
                Enter informations about project.
              </DialogContentText>
              <TextField
                autoFocus
                margin="normal"
                id="projectName"
                label="Name"
                type="text"
                value={projectName}
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
                    value={selectedProjectMembersOptions}
                    onChange={handleChange}
                    IconComponent={KeyboardArrowDownIcon}
                    renderValue={(selected) => (
                    <div style={{display:"flex", flexWrap:"wrap"}}>
                        {(selected as string[]).map((value) => (
                        <Chip
                            key={value}
                            label={value}
                            clickable
                            deleteIcon={
                            <CancelIcon
                                onMouseDown={(event) => event.stopPropagation()}
                            />
                            }
                            onDelete={(e) => handleDelete(e, value)}
                            onClick={() => console.log("clicked chip")}
                            style={{margin: 2}}
                        />
                        ))}
                    </div>
                    )}
                >
            {projectMembersFormOptions.map((user) => (
              <MenuItem key={user} value={user}>
                <Checkbox checked={selectedProjectMembersOptions.includes(user)} />
                <ListItemText primary={user} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
            fullWidth
            autoFocus
            margin="normal"
            type="text"
            value={projectResources}
            onChange={(e) => setProjectResources(parseInt(e.target.value))}
            label="Resources"
            id="resources"
            InputProps={{
            endAdornment: <InputAdornment position="end">
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currency}
                                label="currency"
                                variant="standard"
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <MenuItem value={"EUR"}>€</MenuItem>
                                <MenuItem value={"DOLARS"}>$</MenuItem>
                            </Select>
                        </InputAdornment>,
          }}
          variant="standard"
        />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeForm}>Cancel</Button>
              <Button onClick={onFormSubmit}>Save project</Button>
            </DialogActions>
          </Dialog>
        </div>
      );

};