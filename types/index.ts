export interface LiveError {
  id: number;
  station: string;
  error: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  valueMeasured: string;
  overLimit: string;
  deviceCode: string;
}

export interface Notification {
  id: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  time: string;
}

export interface FailTest {
  name: string;
  fails: number;
}

export interface FailedDevice {
  deviceCode: string;
  measuredValue: string;
  limit: string;
  difference: string;
  timestamp: string;
}


export interface StationData {
  name: string
  value: number
  topTests?: Array<{
    name: string
    count: number
  }>
}

export interface TopTest {
  name: string;
  count: number;
}

export interface IssueData {
  value: number;
  topIssues: string[];
}


export interface TopFails {
  value: number;
  topTests: TopTest[];
}

export interface IssueCount {
  material: number;
  tester: number;
}

export interface FailsData {
  'Top Fails': Record<string, TopFails>;
  'Issue Count': Record<string, IssueCount>;
  [key: string]: any;
}

export interface FailsDataTop {
  'Top Fails': Record<string, TopFails>;
}


export interface FailedTestsData {
  [station: string]: FailTest[];
}

export interface FailedDevicesData {
  [station: string]: {
    [testName: string]: FailedDevice[];
  };
}

export interface SortedData {
  sortedData: FailTest[];
  totalFails: number;
  mostCriticalTest: FailTest;
}