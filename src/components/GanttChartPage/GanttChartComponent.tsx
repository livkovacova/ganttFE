import React from "react";
import {useNavigate} from "react-router-dom";
import { responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import mainTheme from "../commons/mainTheme";
import { GanttChart } from "../commons/GanttChart";
import { Chart } from "react-google-charts";
import { PRIORITY } from "../commons/enums";
import IUser from "../../types/user.type";

interface Props {
    chart: GanttChart,
    currency: string,
    projectMembers: Array<IUser>,
    projectStartDate: Date
}

export const GanttChartComponent = ({chart, currency, projectMembers, projectStartDate}: Props) => {
    const navigate = useNavigate();

    const endOfTheDay = 23 * 60 * 60 * 1000;
    const colorByCustomProperty: { [key: string]: string } = {};

    const getNewDate = (date: Date, start: boolean): Date => {
        const newDate = new Date(date);
        if(start){
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
        }
        else{
            newDate.setHours(23);
            newDate.setMinutes(59);
            newDate.setSeconds(59);
            newDate.setMilliseconds(999);
        }
        return newDate;
    }

    const theme = responsiveFontSizes(mainTheme);

    const getAssigneesProperty = (assignees: Array<number>): string =>{
        const result: Array<string> = [];
        assignees.forEach(assignee => {
            let member = projectMembers.find(member => member.id === assignee);
            if (member != undefined){
                result.push(member.username);
            }
        })
        return result.join(", ");
    }

    const getDependenciesProperty = (dependecies: Array<number>): string =>{
        const result: Array<string> = [];
        dependecies.forEach(dependecy => {
            result.push(dependecy.toString())
        })
        return result.join(",");
    }

    const ganttChartDataColumns = [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: 'number', label: 'Percent Complete' },
        { type: "string", label: "Dependecies" },
        { type: "string", label: "Resource" },
        { type: "string", label: "Priority"},
        { type: "string", label: "Assignees" },
        { typ: "string", label: "Phase"}
    ];

    const taskRows: (string | number | Date | null)[][] = [];
    chart.phases.forEach(phase => {
        phase.tasks.forEach( task =>{
            const startDate = getNewDate(task.startDate, true);
            const endDate = getNewDate(task.endDate, false);
            console.log(startDate + " " + endDate)
            taskRows.push([
                task.workId.toString(),
                task.name,
                new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
                new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
                null,
                null,
                getDependenciesProperty(task.predecessors),
                task.resources.toString() + currency,
                task.priority,
                getAssigneesProperty(task.assignees),
                phase.name
            ])
        })
    })

    const data = [ganttChartDataColumns, ...taskRows];

    const getColorByCustomProperty = (label: string): string => {
        const customProperty = data.find((row) => row[1] === label)![10] as string;
        if (!colorByCustomProperty[customProperty]) {
          colorByCustomProperty[customProperty] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
        return colorByCustomProperty[customProperty];
    };

    const options = {
        height: data.length * 30 + 50,
        gantt: {
            colorByRowLabel: true,
            groupByRowLabel: false,
            barHeight: 30,
            innerGridHorizLine: {
                stroke: '#ccc',
                strokeWidth: 0.5,
          },
        },
        colors: ['yellow', 'blue'],
        rowProperties: {
            phase: {
              label: 'Phase',
              type: 'string',
            },
        },
    };

    return (
        <ThemeProvider theme={theme}>
             <Chart
                chartType="Gantt"
                width="100%"
                height="100%"
                data={data}
                options={options}
            />
        </ThemeProvider>
    );
};