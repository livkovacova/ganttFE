import { ThemeProvider } from "@emotion/react";
import { responsiveFontSizes } from "@mui/material";
import mainTheme from "./mainTheme";
import HorizontalFlow from "./FlowExample";
import { PhaseResponse } from "./Phase";
import { PRIORITY } from "./enums";

export const TestPage = ({}) => {

    type Task = {
        id: string;
        label: string;
        predecessors?: string[];
      };
      
    type Phase = {
        id: string;
        isCollapsed: boolean;
        tasks: Task[];
    };

    const phases: Phase[] = [
        {
            id: "phase1",
            isCollapsed: false,
            tasks: [
                {
                    id: "task 1",
                    label: "task 1",
                    predecessors: []
                },
                {
                    id: "task 2",
                    label: "task 2",
                    predecessors: ["task 1"]
                }
            ]
        },
        {
            id: "phase2",
            isCollapsed: false,
            tasks: [
                {
                    id: "task 3",
                    label: "task 3",
                    predecessors: ["task 2"]
                },
                {
                    id: "task 4",
                    label: "task 4",
                    predecessors: ["task 3"]
                }
            ]
        }
    ]

    const phaseResponses: PhaseResponse[] = [
        {
            workId: 0,
            name: "phase 1",
            tasks: [
                {
                    workId: 0,
                    name: "T0",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [1],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 1,
                    name: "T1",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                },
                {
                    workId: 2,
                    name: "T2",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [1],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                }
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 1,
            name: "phase 2",
            tasks: [
                {
                    workId: 3,
                    name: "T3",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [2],
                    assignees: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                }
            ],
            projectId: 2,
            realId: 1
        },
        {
            workId: 2,
            name: "phase 3",
            tasks: [
                {
                    workId: 4,
                    name: "T4",
                    priority: PRIORITY.LOW,
                    duration: 3,
                    resources: 3,
                    extendable: false,
                    predecessors: [3],
                    assignees: [2],
                    startDate: new Date(),
                    endDate: new Date(),
                    realId: 0
                }
            ],
            projectId: 2,
            realId: 1
        },
        
    ]

    const theme = responsiveFontSizes(mainTheme);

    return (
        <ThemeProvider theme={theme}>
            <div className="pageContainer">
                <HorizontalFlow phases={phaseResponses}/>
            </div>
        </ThemeProvider>
    );
}

export default TestPage;