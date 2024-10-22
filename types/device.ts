export type TestResult = 'passed' | 'failed' | 'in-progress' | 'pending';

export interface Test {
  name: string;
  result: TestResult;
  measuredValue?: string;
  offsetFromLimit?: string;
}

export interface Station {
  name: string;
  status: TestResult;
  tests: Test[];
}

export interface Device {
  code: string;
  type: string;
  currentStation: string;
  stations: Station[];
}

export interface trackTest {
  name: string;
  result: 'passed' | 'failed';
  measuredValue: string;
  offsetFromLimit?: string; // Optional parameter
}

export interface trackStation {
  name: string;
  status: 'passed' | 'failed';
  tests: Test[];
}

export interface trackDevice {
  code: string;
  type: string;
  currentStation: string;
  stations: Station[];
}