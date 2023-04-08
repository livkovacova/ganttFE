import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React, {useEffect, useState} from "react";
import mainTheme from "../commons/mainTheme";
import { responsiveFontSizes } from '@mui/material/styles';
import { NavigationBar } from "../NavigationBar/NavigationBar";
import IUser from "../../types/user.type";
import {useParams, useNavigate} from "react-router-dom";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, ButtonGroup, Dialog, DialogActions, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import "../CreateGanttChartPage/CreateGanttChartPage.css"
import { createGanttChart } from "../../services/GanttChartService";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { DEFAULT_PHASE, Phase } from "../commons/Phase";
import { ProjectPhaseDialog } from "../ProjectPhaseDialog/ProjectPhaseDialog";
import { DEFAULT_PROJECT, Project } from "../commons/Projects";
import _without from "lodash/without";
import { useLocation } from "react-router-dom";

const theme = responsiveFontSizes(mainTheme);

export const GanttChartPage = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const project: Project = location.state.project;
    const currentUser: IUser = location.state.currentUser;
    const phases: Phase[] = location.state.phases;

    const generateGanttChart = async () => {
        const chart = await createGanttChart(project.id, phases);
    };

    React.useEffect(() => {
        generateGanttChart();
    },[]);

    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <NavigationBar withCreate={false} isManager={true} mainTitle={project.name + " | Gantt chart"} userNameLetter={currentUser.username.charAt(0).toUpperCase()}/>
                <div className="chartContainer">
                </div>
                <div className="bottomSectionContainer">
                </div>
            </div>
        </ThemeProvider>
    );
};

export default GanttChartPage;