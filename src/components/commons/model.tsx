export declare enum PAGE_SIZE {
    TEN = "10",
    TWENTY = "20",
    FIFTY = "50",
    HUNDRED = "100"
}

export const enum TIME_UNIT {
    DAYS = "DAYS",
    WEEKS = "WEEKS",
}

const convertInMilis = (duration: number, timeUnit: TIME_UNIT): number => {
    switch(timeUnit){
        case TIME_UNIT.DAYS:{
            return duration * 24 * 60 * 60 * 1000;
        }
        case TIME_UNIT.WEEKS:{
            return duration * 604800000;
        }
        default:{
            return 0;
        }
    }
}