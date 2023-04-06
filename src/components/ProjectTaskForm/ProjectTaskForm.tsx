import { TeamMemberOption } from "../HomePage/teamMemberOption";
import { PredecessorOption } from "../ProjectPhaseDialog/PredecessorOption";
import { Task } from "../commons/Task";
import React from "react";
import { duration, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import mainTheme from "../commons/mainTheme";
import "./ProjectTaskForm.css"
import { Button, ButtonGroup, Checkbox, Chip, FormControl, FormControlLabel, FormHelperText, IconButton, InputAdornment, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Switch, TextField } from "@mui/material";
import { TIME_UNIT } from "../commons/model";
import _without from "lodash/without";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';


interface Props {
    isEditing: boolean;
    taskForAction: Task;
    refreshPage: () => void;
    onSubmit: (task:Task, isEditing:boolean) => void;
    onDelete: (task:Task) => void;
    assigneesOptions: Array<TeamMemberOption>;
    predecessorsOptions: Array<PredecessorOption>;
    currency: string;
}

export const ProjectTaskForm = ({ isEditing, taskForAction, refreshPage, onSubmit, onDelete, assigneesOptions, predecessorsOptions, currency }: Props) => {

    const [errorTaskName, setErrorTaskName] = React.useState(false);
    const [taskName, setTaskName] = React.useState(taskForAction.name);
    const [taskDuration, setTaskDuration] = React.useState(taskForAction.duration);
    const [timeUnit, setTimeUnit] = React.useState<string>(TIME_UNIT.DAYS);
    const [taskResources, setTaskResources] = React.useState(taskForAction.resources);
    const [extendable, setExtendable] = React.useState(taskForAction.extendable);
    const [selectedTaskAssignees, setSelectedTaskAssignees] = React.useState<Array<TeamMemberOption>>([]);
    const [selectedTaskPredecessors, setSelectedTaskPredecessors] = React.useState<Array<PredecessorOption>>([]);
    const [saved, setSaved] = React.useState(false);

    const setNewTaskName = (name: string) => {
        taskForAction.name = name;
        setTaskName(name);
    }

    const setNewTaskDuration = (duration: number) => {
        taskForAction.duration = duration;
        setTaskDuration(duration);
    }

    const setNewTaskResources = (resources: number) => {
        taskForAction.resources = resources;
        setTaskResources(resources);
    }

    const toggleExtendable = (checked: boolean) => {
        taskForAction.extendable = checked;
        setExtendable(checked);
    }

    const handleChangeAssignees = (event: SelectChangeEvent<typeof selectedTaskAssignees>) => {
        const {
          target: { value },
        } = event;
        setSelectedTaskAssignees(
          event.target.value as TeamMemberOption[]
        );
        let assignes = event.target.value as TeamMemberOption[];
        taskForAction.assignees = assignes.map((assignee) => assignee.value)
    };

    const handleDeleteAssignees = (e: React.MouseEvent, value: TeamMemberOption) => {
        e.preventDefault();
        setSelectedTaskAssignees((current) => _without(current, value));
        taskForAction.assignees = selectedTaskAssignees.map((assignee) => assignee.value);
    };

    const handleChangePredecessors = (event: SelectChangeEvent<typeof selectedTaskPredecessors>) => {
        const {
          target: { value },
        } = event;
        setSelectedTaskPredecessors(
          event.target.value as PredecessorOption[]
        );
        let predecessors = event.target.value as PredecessorOption[];
        taskForAction.predecessors = predecessors.map((predecessor) => predecessor.value);
    };

    const handleDeletePredecessor = (e: React.MouseEvent, value: PredecessorOption) => {
        e.preventDefault();
        setSelectedTaskPredecessors((current) => _without(current, value));
        taskForAction.predecessors = selectedTaskPredecessors.map((predecessor) => predecessor.value);
    };


    const handleSaveClick = (task: Task) => {
        setSaved(true);
        onSubmit(task, saved);
    }

    const findAssignees = (): TeamMemberOption[] => {
        let foundSelectedAssignees: TeamMemberOption[] = [];
        taskForAction.assignees.forEach((assignee) => {
            let founded = assigneesOptions.find((option) => option.value === assignee);
            if(founded){
                foundSelectedAssignees.push(founded);
            }
        })
        return foundSelectedAssignees;
    }

    const findPredecessors = (): PredecessorOption[] => {
        let foundSelectedPredecessors: PredecessorOption[] = [];
        taskForAction.predecessors.forEach((predecessor) => {
            let found = predecessorsOptions.find((option) => option.value === predecessor);
            if(found){
                foundSelectedPredecessors.push(found);
            }
        })
        return foundSelectedPredecessors;
    }

    const findAndSetSelectedOptions = () => {
        setSelectedTaskAssignees(findAssignees);
        setSelectedTaskPredecessors(findPredecessors);
    }

    React.useEffect(() => {
        findAndSetSelectedOptions();
    }, [saved]);

    React.useEffect(() => {
        setSelectedTaskPredecessors(findPredecessors);
     },[predecessorsOptions])

    const theme = responsiveFontSizes(mainTheme);

    return (
        <ThemeProvider theme={theme}>
            <div className="taskFormContainer">
                <div className="taskInfoContainer">
                <TextField
                autoFocus
                margin="dense"
                id="taskName"
                label="Name"
                type="text"
                value={taskName}
                fullWidth
                size="small"
                variant="standard"
                onChange={(e) => setNewTaskName(e.target.value)}
              />
              {
                errorTaskName ?
                        (<FormHelperText
                            id="taskNameHelper"
                            error={true}>
                            Task name should have at least 3 and max 30 letters!
                        </FormHelperText>) :
                        null
                }

                <TextField
                fullWidth
                autoFocus
                margin="dense"
                type="number"
                value={taskDuration.toString(10)}
                onChange={(e) => setNewTaskDuration(parseInt(e.target.value))}
                label="Duration"
                id="duration"
                InputLabelProps={{
                    shrink: true,
                }}
                size="small"
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={timeUnit}
                                        label="time unit"
                                        variant="standard"
                                        size="small"
                                        onChange={(e) => setTimeUnit(e.target.value)}
                                    >
                                        <MenuItem value={TIME_UNIT.DAYS}>days</MenuItem>
                                        <MenuItem value={TIME_UNIT.WEEKS}>weeks</MenuItem>
                                    </Select>
                                </InputAdornment>,
                    inputProps: { 
                        min: 1 
                    },
                }}
                variant="standard"
                />

                <FormControl>
                    <FormControlLabel
                            control={
                                <Switch checked={extendable} onChange={(e) => toggleExtendable(e.target.checked)} name="jason" />
                            }
                            label="Extendable"
                            labelPlacement="end"
                            sx={{marginRight:0, flexDirection:"row"}}
                    />
                </FormControl>

                <TextField
                fullWidth
                autoFocus
                margin="dense"
                type="number"
                value={taskResources.toString(10)}
                onChange={(e) => setNewTaskResources(parseInt(e.target.value))}
                label="Resources"
                id="resources"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end">{currency}</InputAdornment>,
                    inputProps: { 
                        min: 0 
                    }
                }}
                variant="standard"
                />

                </div>
                <div className="taskInfoContainer">
                    <FormControl fullWidth margin="dense">
                    <InputLabel id="mutiple-chip-label">Task Assignees</InputLabel>
                    <Select
                        labelId="mutiple-chip-label"
                        label="Task Assignees"
                        id="mutiple-chip"
                        multiple
                        variant="outlined"
                        value={selectedTaskAssignees}
                        onChange={handleChangeAssignees}
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
                                onDelete={(e) => {handleDeleteAssignees(e, value)}}
                                onClick={() => console.log("clicked chip")}
                                style={{margin: 2}}
                            />
                            ))}
                        </div>
                        )}
                    >
                {assigneesOptions.map((user) => (
                    //@ts-ignore
                <MenuItem key={user.value} value={user}>
                    <Checkbox checked={selectedTaskAssignees.includes(user)} />
                    <ListItemText primary={user.text} />
                </MenuItem>
                ))}
            </Select>
            </FormControl>
                </div>
                <div className="taskInfoContainer">
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="mutiple-chip-label2">Task Predecessors</InputLabel>
                        <Select
                            labelId="mutiple-chip-label2"
                            label="Task Predecessors"
                            id="mutiple-chip2"
                            multiple
                            variant="outlined"
                            value={selectedTaskPredecessors}
                            onChange={handleChangePredecessors}
                            IconComponent={KeyboardArrowDownIcon}
                            renderValue={() => (
                            <div style={{display:"flex", flexWrap:"wrap"}}>
                                {(selectedTaskPredecessors as PredecessorOption[]).map((value) => (
                                // <Chip
                                //     key={value.value}
                                //     label={value.text}
                                //     clickable
                                //     deleteIcon={
                                //     <CancelIcon
                                //         onMouseDown={(event) => event.stopPropagation()}
                                //     />
                                //     }
                                //     onDelete={(e) => {handleDeletePredecessor(e, value)}}
                                //     onClick={() => console.log("clicked chip")}
                                //     style={{margin: 2}}
                                // />
                                value.text
                                ))}
                            </div>
                            )}
                        >
                    {predecessorsOptions.map((predecessor) => (
                        //@ts-ignore
                    <MenuItem key={predecessor.value} value={predecessor}>
                        <Checkbox checked={selectedTaskPredecessors.some((predItem) => predItem.value === predecessor.value)} />
                        <ListItemText primary={predecessor.text} />
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
            <ButtonGroup orientation="horizontal" sx={{justifyContent:"flex-end"}}>
                <Button color="secondary" onClick={() => {onDelete(taskForAction)}}>
                    REMOVE
                </Button>
                {saved? (
                <Button color="primary" onClick={() => {handleSaveClick(taskForAction)}}>
                    UPDATE
                </Button>
                ) : (
                <Button color="primary" onClick={() => {handleSaveClick(taskForAction)}}>
                    SAVE
                </Button>
                )}
            </ButtonGroup>
                </div>
            </div>
        </ThemeProvider>
      );
}