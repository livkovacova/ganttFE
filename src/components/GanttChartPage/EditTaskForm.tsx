import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Chip, Dialog, DialogActions, DialogTitle, OutlinedInput, TextField, Typography } from '@mui/material';
import { Task } from 'gantt-task-react';
import { ExtendedTask } from './GanttChartUtils';
import { TeamMemberOption } from '../commons/TeamMemberOption';
import { PRIORITY } from '../commons/enums';
import IUser from '../../types/user.type';

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (task: Task) => void
    taskToEdit: ExtendedTask
    assigneesOptions: TeamMemberOption[],
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

export const EditTaskForm = ({isOpen, onClose, onSubmit, taskToEdit, assigneesOptions}: Props) => {
    const [resources, setResources] = useState<number>(parseInt(taskToEdit.resources!));
    const [assignees, setAssignees] = useState<TeamMemberOption[]>([]);
    const [priority, setPriority] = useState<PRIORITY>(taskToEdit.priority!);

    const handleChangeResources = (event: SelectChangeEvent) => {
        setResources(event.target.value as number);
    };

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
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                <Typography variant="h5">{taskToEdit.name}</Typography>
                <Typography variant="body2">Edit task details</Typography>
            </DialogTitle>
            <div>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-chip-label">Assignees</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={assignees}
                        onChange={handleChangeAssignees}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
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

                <TextField
                fullWidth
                autoFocus
                margin="dense"
                type="number"
                value={resources}
                onChange={(e) => setResources(parseInt(e.target.value))}
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
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={() => onSubmit(taskToEdit)} color="warning" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}