export interface Limit {
  min: any;
  max: any;
}

export interface Limits {
  [key: string]: Limit;
}



export interface TestRecord {
  deviceCode: string;
  measuredValue: number;
  limit: number;
  difference: number;
  timestamp: string;
}

export interface StationData {
  [testName: string]: TestRecord[];
}

export interface FailsData {
  [stationName: string]: StationData;
}