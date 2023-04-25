import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Chip, Dialog, DialogActions, DialogTitle, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';
import { Task } from 'gantt-task-react';
import { ExtendedTask } from './GanttChartUtils';
import { TeamMemberOption } from '../commons/TeamMemberOption';
import { PRIORITY } from '../commons/enums';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (task: Task, assignees: TeamMemberOption[], priority: PRIORITY, resources: number) => void
    taskToEdit: ExtendedTask
    assigneesOptions: TeamMemberOption[],
    currency: string
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const EditTaskForm = ({ isOpen, onClose, onSubmit, taskToEdit, assigneesOptions, currency }: Props) => {
    const [resources, setResources] = useState<number>(0);
    const [assignees, setAssignees] = useState<TeamMemberOption[]>([]);
    const [priority, setPriority] = useState<PRIORITY>(PRIORITY.LOW);

    React.useEffect(() => {
        if (taskToEdit.resources != undefined) {
            setResources(parseInt(taskToEdit.resources!.substring(0, taskToEdit.resources!.length - 4)))
        }
        if (taskToEdit.priority != undefined) {
            setPriority(taskToEdit.priority)
        }
        if (taskToEdit.assignees != undefined) {
            let assigneesFromTaskToEdit = taskToEdit.assignees.split(", ");
            let selectedAssignees = assigneesOptions.filter(option => assigneesFromTaskToEdit.some(assignee => assignee === option.text));
            setAssignees(selectedAssignees);
        }
    }, [taskToEdit]);

    const setNewTaskResources = (resources: number) => {
        taskToEdit.resources = resources.toString()+" "+currency;
        setResources(resources);
    }

    const setNewPriority = (priority: PRIORITY) => {
        taskToEdit.priority = priority;
        setPriority(priority);
    }

    const handleChangeAssignees = (event: SelectChangeEvent<typeof assignees>) => {
        const {
            target: { value },
        } = event;
        setAssignees(
            event.target.value as TeamMemberOption[]
        );
        const newAssignees = event.target.value as TeamMemberOption[]
        const newGAssignees = newAssignees.map(assignee => assignee.text).join(", ");
        taskToEdit.assignees = newGAssignees;
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm">
            <DialogTitle>
                <Typography variant="h5">{taskToEdit.name}</Typography>
                <Typography variant="body2">Edit task details</Typography>
            </DialogTitle>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{display:"flex", flexDirection: "row", justifyContent:"space-around"}}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="assignees-chip-label">Assignees</InputLabel>
                        <Select
                            labelId="assignees-chip-label"
                            id="assignees-chip"
                            label="Assignees"
                            multiple
                            variant='outlined'
                            value={assignees}
                            onChange={handleChangeAssignees}
                            IconComponent={KeyboardArrowDownIcon}
                            input={<OutlinedInput id="select-multiple-chip" label="Assignees" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as TeamMemberOption[]).map((value) => (
                                        <Chip key={value.value} label={value.text} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {assigneesOptions.map((assignee) => (
                                //@ts-ignore
                                <MenuItem
                                    key={assignee.value}
                                    value={assignee}
                                >
                                    {assignee.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, width: 200 }} >
                        <InputLabel id="priority-select-label">Priority</InputLabel>
                        <Select
                            labelId="priority-select-label"
                            id="priority-simple-select"
                            value={priority}
                            label="Priority"
                            size="small"
                            fullWidth
                            IconComponent={KeyboardArrowDownIcon}
                            onChange={(e) => setNewPriority(e.target.value as PRIORITY)}
                        >
                            <MenuItem value={PRIORITY.LOW} color="blue">LOW</MenuItem>
                            <MenuItem value={PRIORITY.MEDIUM} color="green">MEDIUM</MenuItem>
                            <MenuItem value={PRIORITY.HIGH} color="red">HIGH</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <TextField
                    autoFocus
                    margin="dense"
                    type="number"
                    value={resources.toString()}
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
                    sx={{width: 300, m:1, marginLeft: 3}}
                />
            </div>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={() => onSubmit(taskToEdit, assignees, priority, resources)} color="warning" variant="contained">Save</Button>
            </DialogActions>
        </Dialog >
    );
}