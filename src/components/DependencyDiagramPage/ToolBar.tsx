import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ThemeProvider, responsiveFontSizes } from '@mui/material';
import mainTheme from '../commons/mainTheme';

interface Props {
    phases: string[],
    assignees: string[],
    handleFilterChange: (phaseMap: Map<string, boolean>, assigneeMap: Map<string, boolean>) => void;
}

function setInitialPhasesState(phases: string[]){
    const phaseState = new Map<string, boolean>();
    phases.forEach(phase => {
        phaseState.set(phase, true);
    })
    return phaseState;
}

function setInitialAssigneeState(assignees: string[]){
    const assigneeState = new Map<string, boolean>();
    assignees.forEach(assignee => {
        assigneeState.set(assignee, true);
    })
    return assigneeState;
}

export default function ToolBar({phases, assignees, handleFilterChange}: Props) {
  const [phaseState, setPhasesState] = React.useState<Map<string, boolean>>(setInitialPhasesState(phases));
  const [assigneesState, setAssigneesState] = React.useState<Map<string, boolean>>(setInitialAssigneeState(assignees));

  const handlePhaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhasesState(phaseState.set(event.target.name, event.target.checked));
    handleFilterChange(phaseState, assigneesState)
  }

  const handleAssigneeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssigneesState(assigneesState.set(event.target.name, event.target.checked));
    handleFilterChange(phaseState, assigneesState);
  }

  const renderPhaseOptions = () => {
    return phases.map(phase => 
        <FormControlLabel
            key={phase}
            control={
              <Checkbox checked={phaseState.get(phase)} onChange={handlePhaseChange} name={phase} />
            }
            label={phase}
          />
    )
  }

  const renderAssigneeOptions = () => {
    return assignees.map(assignee => 
        <FormControlLabel
            key={assignee}
            control={
              <Checkbox checked={assigneesState.get(assignee)} onChange={handleAssigneeChange} name={assignee} />
            }
            label={assignee}
          />
    )
  }

  const theme = responsiveFontSizes(mainTheme);

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: 'flex' , flexDirection: "column"}}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel color="primary" component="legend">Phases</FormLabel>
        <FormGroup>
          {renderPhaseOptions()}
        </FormGroup>
        <FormLabel component="legend">Assignee</FormLabel>
        <FormGroup>
          {renderAssigneeOptions()}
        </FormGroup>
      </FormControl>
    </Box>
    </ThemeProvider>
  );
}
