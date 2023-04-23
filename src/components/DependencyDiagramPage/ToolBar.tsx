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
    handleFilterChange: (phaseMap: Map<string, boolean>, assigneeMap: Map<string, boolean>, stateMap: Map<string, boolean>) => void;
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
  const [progressState, setProgressState] = React.useState<Map<string, boolean>>(new Map([
    ['not started', true],
    ['in progress', true],
    ['done', true]
  ]))

  const handlePhaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhasesState(phaseState.set(event.target.name, event.target.checked));
    handleFilterChange(phaseState, assigneesState, progressState)
  }

  const handleAssigneeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssigneesState(assigneesState.set(event.target.name, event.target.checked));
    handleFilterChange(phaseState, assigneesState, progressState);
  }

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgressState(progressState.set(event.target.name, event.target.checked));
    handleFilterChange(phaseState, assigneesState, progressState);
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
    {/* <Box sx={{ }}> */}
      <FormControl sx={{padding:"2vh", display: 'flex' , flexDirection: "column", justifyContent:"space-between", height: "80vh"}} component="fieldset" variant="standard">
        <div>
          <FormLabel color="primary" component="legend">Phases</FormLabel>
          <div style={{maxHeight:"25vh", overflowY:'auto'}}>
          <FormGroup>
            {renderPhaseOptions()}
          </FormGroup>
          </div>
        </div>
        <div>
          <FormLabel className="toolLabel" component="legend">Assignee</FormLabel>
          <div style={{maxHeight:"25vh", overflowY:'auto'}}>
          <FormGroup>
            {renderAssigneeOptions()}
          </FormGroup>
          </div>
        </div>
        <div>
          <FormLabel className="toolLabel" component="legend">State</FormLabel>
          <div style={{justifySelf:"flex-end"}}>
          <FormGroup>
          <FormControlLabel
              control={
                <Checkbox checked={progressState.get('not started')} onChange={handleProgressChange} name='not started' />
              }
              label='not started'
            />
            <FormControlLabel
              control={
                <Checkbox checked={progressState.get('in progress')} onChange={handleProgressChange} name='in progress' />
              }
              label='in progress'
            />
            <FormControlLabel
              control={
                <Checkbox checked={progressState.get('done')} onChange={handleProgressChange} name='done' />
              }
              label='done'
            />
          </FormGroup>
          </div>
        </div>
      </FormControl>
    {/* </Box> */}
    </ThemeProvider>
  );
}
