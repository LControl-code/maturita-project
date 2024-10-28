export interface ErrorDetail {
  test: string
  value: number
  limit: number
  severity: 'low' | 'medium' | 'high'
  type: 'above' | 'below'
}

export interface ErrorData {
  id: string
  station: string
  errors: ErrorDetail[]
  deviceCode: string
  timestamp: string
  deviceId: string
}

export interface ErrorDataDatabase {
  id: string;
  station: string;
  errors: Array<{
    test: string;
    value: number;
    limit: number;
    type: 'above' | 'below';
    offset: number;
  }>;
  deviceCode: string;
  timestamp: string;
  deviceId: string;
}

export interface TestData {
  [key: string]: number
}

export interface LiveErrorRecord {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  time: string
  station_name: string
  motor_type: string
  device_code: string
  device_id: string
  test_data: TestData | string // Can be string when received from PB
}