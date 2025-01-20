// components/FailedTestsGraphOld/types.ts
export type FailedTestData = {
    // Define your data structure
    station: string;
    // ... other fields
}

export type FailedTestsGraphProps = {
    initialData: FailedTestData[];
}

export interface TestRecord {
    deviceCode: string;
    deviceType: string;
    difference: number;
    limit: number;
    line: string;
    type: string;
    measuredValue: number;
    time: string;
}

export interface FailsData {
    [stationName: string]: {
        [testName: string]: TestRecord[];
    };
}

