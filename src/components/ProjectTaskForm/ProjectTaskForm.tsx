import { TeamMemberOption } from "../commons/TeamMemberOption";
import { PredecessorOption } from "../commons/PredecessorOption";
import { Task } from "../commons/Task";
import React from "react";
import { responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import mainTheme from "../commons/mainTheme";
import "./ProjectTaskForm.css"
import { Button, ButtonGroup, Checkbox, Chip, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { PRIORITY, TIME_UNIT } from "../commons/enums";
import _without from "lodash/without";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';


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
    const [taskState, setTaskState] = React.useState(taskForAction.state);
    const [priority, setPriority] = React.useState<string>(taskForAction.priority);
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

    const setNewPriority = (priority: PRIORITY) => {
        taskForAction.priority = priority;
        setPriority(priority);
    }

    const setNewTaskResources = (resources: number) => {
        taskForAction.resources = resources;
        setTaskResources(resources);
    }

    const setNewTaskState = (state: number) => {
        taskForAction.state = state;
        setTaskState(state);
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
        taskForAction.predecessors = _without(taskForAction.predecessors, value.value);
    };


    const handleSaveClick = (task: Task) => {
        onSubmit(task, (saved || isEditing));
        setSaved(true);
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
    }, [saved, assigneesOptions]);

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

                <div className="furtherInfoContainer">

                    <FormControl >
                        <InputLabel id="priority-select-label">Priority</InputLabel>
                        <Select
                            labelId="priority-select-label"
                            id="priority-simple-select"
                            value={priority}
                            label="Priority"
                            size="small"
                            fullWidth
                            onChange={(e) => setNewPriority(e.target.value as PRIORITY)}
                        >
                        <MenuItem value={PRIORITY.LOW} color="blue">LOW</MenuItem>
                        <MenuItem value={PRIORITY.MEDIUM} color="green">MEDIUM</MenuItem>
                        <MenuItem value={PRIORITY.HIGH} color="red">HIGH</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        autoFocus
                        margin="dense"
                        type="number"
                        value={taskState.toString(10)}
                        onChange={(e) => setNewTaskState(parseInt(e.target.value))}
                        label="State"
                        id="state"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            inputProps: { 
                                min: 0,
                                max: 100
                            }
                        }}
                        variant="standard"
                        sx={{width: "30%", marginTop:0}}
                    />
                    
                </div>

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
                            renderValue={(selected) => (
                            <div style={{display:"flex", flexWrap:"wrap"}}>
                                {(selected as PredecessorOption[]).map((value) => (
                                <Chip
                                    key={value.value}
                                    label={value.text}
                                    clickable
                                    deleteIcon={
                                    <CancelIcon
                                        onMouseDown={(event) => event.stopPropagation()}
                                    />
                                    }
                                    onDelete={(e) => {handleDeletePredecessor(e, value)}}
                                    onClick={() => console.log("clicked chip")}
                                    style={{margin: 2}}
                                />
                                ))}
                            </div>
                            )}
                        >
                    {predecessorsOptions.map((predecessor) => (
                        //@ts-ignore
                    <MenuItem key={predecessor.value} value={predecessor}>
                        {/* <Checkbox checked={selectedTaskPredecessors.some((predItem) => predItem.value === predecessor.value)} /> */}
                        <Checkbox checked={selectedTaskPredecessors.includes(predecessor)} />
                        <ListItemText primary={predecessor.text} />
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
            <ButtonGroup orientation="horizontal" sx={{justifyContent:"flex-end"}}>
                <Button color="secondary" onClick={() => {onDelete(taskForAction)}}>
                    REMOVE
                </Button>
                {saved || isEditing? (
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