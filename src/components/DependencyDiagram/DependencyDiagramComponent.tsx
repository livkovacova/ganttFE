import React, {useEffect, useState} from "react";
import { PhaseResponse } from "../commons/Phase";
import "./DependencyDiagramPage.css"
import { IconButton, ThemeProvider, Typography, responsiveFontSizes } from "@mui/material";
import mainTheme from "../commons/mainTheme";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";


interface Props {
    phases: PhaseResponse[]
}

export const DependencyDiagram = ({phases}: Props) => {
    
    const setExpandedToFalse = () => {
        let phaseExpandedMap = new Map<number, boolean>();
        phases.forEach(phase => {
            phaseExpandedMap.set(phase.workId, false)
        })
        return phaseExpandedMap;
    }

    const [phaseExpanded, setPhaseExpanded] = useState<Map<number, boolean>>(setExpandedToFalse());
    const [expandChangeToggle, setExpandChangeToggle] = useState(false);

    const handleExpandClick = (phaseId: number) => {
        const changedPhaseMap = phaseExpanded.set(phaseId, !phaseExpanded.get(phaseId));
        setPhaseExpanded(changedPhaseMap);
        setExpandChangeToggle(!expandChangeToggle);
        console.log("handle");
    }

    React.useEffect(() => {
        renderPhases();
    },[expandChangeToggle, phaseExpanded]);

    const theme = responsiveFontSizes(mainTheme);

    const renderPhases = (): React.ReactNode => {
        console.log("render");
        return (<>
                {phases.map((phase) =>
                    <div key={phase.workId} className="phaseContainer" style={{flexGrow: phaseExpanded.get(phase.workId) ? undefined : "1"}}>
                        <div className="phaseHeader">
                            <Typography variant="body1" sx={{fontWeight: "bold", marginLeft: "1vw"}}>{phase.name}</Typography>
                            <IconButton
                                onClick={() => handleExpandClick(phase.workId)}
                                color="secondary"
                                
                            >
                                {phaseExpanded.get(phase.workId) ? (
                                    <ChevronLeft/>
                                ): (
                                    <ChevronRight/>
                                )}
                            
                             </IconButton>
                        </div>

                        <div className="phaseTasks">
                            {phaseExpanded.get(phase.workId)? (
                                <>
                                {phase.tasks.forEach(task => {
                                    
                                })}
                                </>
                            ):
                            undefined}
                        </div>
                    </div>
                    )
                }
        </>)
    }


    return (
        <ThemeProvider theme={theme}>
            <div className="phasesWrapper">
            {renderPhases()}
            </div>
        </ThemeProvider>
      );
}