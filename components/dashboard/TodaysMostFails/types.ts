export interface StationInfo {
    count: number;
    stationLineKey: string;
}

export interface DevicePair {
    device_code: string;
    id: string;
}

export interface TopTestGlobal {
    count: number;
    name: string;
    stations: StationInfo[]; // Only in the Global subset
}

export interface TopTestStation {
    count: number;
    name: string;
    devicePairs?: DevicePair[]; // Only in the Stations subset
}

export interface GlobalData {
    topTests: TopTestGlobal[];
    totalFails: number;
}

export interface StationData {
    stationLineKey: string;
    topTests: TopTestStation[];
}

export interface TopFailsData {
    Global: GlobalData;
    Stations: StationData[];
}

/**
 * Master shape for the entire API response
 */
export interface FailsData {
    "Top Fails": TopFailsData;
}
