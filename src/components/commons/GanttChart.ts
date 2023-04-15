import { Phase, PhaseResponse } from "./Phase";
import { PRIORITY } from "./enums";

export interface GanttChart {
    id: number;
    phases: Array<PhaseResponse>;
    project: number;
}

export const DEFAULT_CHART: GanttChart = {
    id: 0,
    phases: [],
    project: 0
}

export const MODEL_CHART: GanttChart = {
    id: 0,
    phases: [
        {
            workId: 0,
            name: "phase 1",
            tasks: [
                {
                    workId: 0,
                    name: "New task 1",
                    priority: PRIORITY.HIGH,
                    duration: 21,
                    resources: 21,
                    extendable: false,
                    predecessors: [],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-04-01T00:00:00.000Z"),
                    endDate: new Date("2023-04-21T00:00:00.000Z")
                },
                {
                    workId: 1,
                    name: "New task 2",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 21,
                    extendable: false,
                    predecessors: [0],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-04-22T00:00:00.000Z"),
                    endDate: new Date("2023-04-26T00:00:00.000Z")
                },
                
            ],
            "projectId": 1
        },
        {
            workId: 1,
            name: "phase 2",
            tasks: [
                {
                    workId: 3,
                    name: "New task 3",
                    priority: PRIORITY.HIGH,
                    duration: 2,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-04-27T00:00:00.000Z"),
                    endDate: new Date("2023-04-28T00:00:00.000Z")
                },
                {
                    workId: 4,
                    name: "New task 4",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-04-27T00:00:00.000Z"),
                    endDate: new Date("2023-05-01T00:00:00.000Z")
                },
                {
                    workId: 5,
                    name: "New task 5",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-05-01T00:00:00.000Z"),
                    endDate: new Date("2023-05-02T00:00:00.000Z")
                },
                {
                    workId: 6,
                    name: "New task 6",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-05-02T00:00:00.000Z"),
                    endDate: new Date("2023-05-03T00:00:00.000Z")
                },
                {
                    workId: 7,
                    name: "New task 7",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-05-03T00:00:00.000Z"),
                    endDate: new Date("2023-05-04T00:00:00.000Z")
                },
                {
                    workId: 8,
                    name: "New task 8",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-05-04T00:00:00.000Z"),
                    endDate: new Date("2023-05-05T00:00:00.000Z")
                },
                {
                    workId: 9,
                    name: "New task 9",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-05-05T00:00:00.000Z"),
                    endDate: new Date("2023-05-07T00:00:00.000Z")
                },
                {
                    workId: 10,
                    name: "New task 10",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-05-07T00:00:00.000Z"),
                    endDate: new Date("2023-05-08T00:00:00.000Z")
                },
                {
                    workId: 11,
                    name: "New task 11",
                    priority: PRIORITY.HIGH,
                    duration: 5,
                    resources: 22,
                    extendable: false,
                    predecessors: [1],
                    assignees: [
                        0
                    ],
                    startDate: new Date("2023-05-08T00:00:00.000Z"),
                    endDate: new Date("2023-05-09T00:00:00.000Z")
                },
                
            ],
            "projectId": 1
        },
        
    ],
    "project": 1
}