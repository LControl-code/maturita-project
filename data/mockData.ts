import { LiveError, Notification, FailsData, FailedTestsData, FailedDevicesData } from '@/types';
import { Device } from '@/types/device';

export const liveErrors: LiveError[] = [
  {
    id: 1,
    station: "A26",
    error: "Voltage Fluctuation",
    severity: "high",
    description: "Voltage has fluctuated beyond acceptable limits.",
    valueMeasured: "250V",
    overLimit: "+20V",
    deviceCode: "R2S16GK2JCO1"
  },
  {
    id: 2,
    station: "S02",
    error: "Temperature Overload",
    severity: "medium",
    description: "Temperature has exceeded the safe threshold.",
    valueMeasured: "85°C",
    overLimit: "+10°C",
    deviceCode: "R2S16GK2JCO2"
  },
  {
    id: 3,
    station: "R23",
    error: "Pressure Drop",
    severity: "low",
    description: "Pressure has dropped below the minimum required level.",
    valueMeasured: "30psi",
    overLimit: "-5psi",
    deviceCode: "R2S16GK2JCO3"
  },
  {
    id: 4,
    station: "A26",
    error: "Current Surge",
    severity: "high",
    description: "Current has surged beyond acceptable limits.",
    valueMeasured: "15A",
    overLimit: "+5A",
    deviceCode: "R2S16GK2JCO4"
  },
  {
    id: 5,
    station: "S02",
    error: "Humidity Spike",
    severity: "medium",
    description: "Humidity levels have spiked beyond safe limits.",
    valueMeasured: "90%",
    overLimit: "+15%",
    deviceCode: "R2S16GK2JCO5"
  },
  {
    id: 6,
    station: "R23",
    error: "Vibration Anomaly",
    severity: "low",
    description: "Vibration levels have deviated from the norm.",
    valueMeasured: "5mm/s",
    overLimit: "+2mm/s",
    deviceCode: "R2S16GK2JCO6"
  },
  {
    id: 7,
    station: "A26",
    error: "Power Loss",
    severity: "high",
    description: "Unexpected power loss detected.",
    valueMeasured: "0W",
    overLimit: "-50W",
    deviceCode: "R2S16GK2JCO7"
  },
  {
    id: 8,
    station: "S02",
    error: "Speed Deviation",
    severity: "medium",
    description: "Speed has deviated from the set point.",
    valueMeasured: "1200rpm",
    overLimit: "-200rpm",
    deviceCode: "R2S16GK2JCO8"
  }
];

export const notifications: Notification[] = [
  { id: 1, type: 'error', message: 'Critical error in A26: Voltage Fluctuation', time: '2 minutes ago' },
  { id: 2, type: 'warning', message: 'Maintenance required for S02: Temperature Overload', time: '1 hour ago' },
  { id: 3, type: 'info', message: 'New software update available: Version 2.1.0', time: '3 hours ago' },
  { id: 4, type: 'error', message: 'Power fluctuation detected in R23: Pressure Drop', time: '5 hours ago' },
  { id: 5, type: 'info', message: 'Scheduled maintenance for A26 at 3:00 PM', time: '6 hours ago' },
  { id: 6, type: 'warning', message: 'High humidity levels detected in S02: Humidity Spike', time: '8 hours ago' },
  { id: 7, type: 'error', message: 'Unexpected power loss in A26: Power Loss', time: '10 hours ago' },
  { id: 8, type: 'info', message: 'New training module available for station operators', time: '12 hours ago' },
  { id: 9, type: 'warning', message: 'Speed deviation detected in S02: Speed Deviation', time: '14 hours ago' },
  { id: 10, type: 'error', message: 'Vibration anomaly detected in R23: Vibration Anomaly', time: '16 hours ago' },
];

export const failsData: FailsData = {
  'Top Fails': {
    'A26': { value: 6, topTests: [{ name: 'Un_VW', count: 3 }, { name: 'Offset_WR_WU_Res', count: 2 }, { name: 'Offset_WR_UV_Res', count: 1 }] },
    'S02': { value: 8, topTests: [{ name: 'Surge_V_WU_AreaDiff', count: 5 }, { name: 'Un_UV', count: 2 }, { name: 'Offset_WR_VW_Res', count: 1 }] },
    'R23': { value: 12, topTests: [{ name: 'Offset_WR_WU_Res', count: 7 }, { name: 'Surge_V_WU_AreaDiff', count: 3 }, { name: 'Un_UV', count: 2 }] },
  },
  'Issue Count': {
    'A26': {
      material: 20,
      tester: 15,
    },
    'S02': {
      material: 10,
      tester: 8,
    },
    'R23': {
      material: 5,
      tester: 3,
    },
  },
};

export const failedTestsData: FailedTestsData = {
  'A26': [
    { name: 'Offset_WR_UV_Res', fails: 1 },
    { name: 'Offset_WR_VW_Res', fails: 0 },
    { name: 'Offset_WR_WU_Res', fails: 2 },
    { name: 'Un_UV', fails: 0 },
    { name: 'Un_VW', fails: 3 },
    { name: 'Un_WU', fails: 1 },
    { name: 'Surge_U_VW_AreaDiff', fails: 0 },
    { name: 'Surge_V_WU_AreaDiff', fails: 4 },
    { name: 'Surge_W_UV_AreaDiff', fails: 0 },
    { name: 'Surge_U_VW_DiffArea', fails: 1 },
    { name: 'Surge_V_WU_DiffArea', fails: 0 },
    { name: 'Surge_W_UV_DiffArea', fails: 2 },
    { name: 'Surge_U_VW_L_Vale', fails: 0 },
    { name: 'Surge_V_WU_L_Vale', fails: 1 },
    { name: 'Surge_W_UV_L_Vale', fails: 0 },
    { name: 'IR_1_UVW_G_NTC', fails: 3 },
    { name: 'IR_2_NTC_G', fails: 0 },
    { name: 'HiPot_1_UVW_G_NTC', fails: 1 },
    { name: 'HiPot_2_NTC_G', fails: 0 },
    { name: 'NTC1_Res', fails: 2 },
    { name: 'NTC2_Res', fails: 0 },
  ],
  'S02': [
    { name: 'Offset_WR_UV_Res', fails: 0 },
    { name: 'Offset_WR_VW_Res', fails: 1 },
    { name: 'Offset_WR_WU_Res', fails: 0 },
    { name: 'Un_UV', fails: 2 },
    { name: 'Un_VW', fails: 0 },
    { name: 'Un_WU', fails: 1 },
    { name: 'Surge_U_VW_AreaDiff', fails: 0 },
    { name: 'Surge_V_WU_AreaDiff', fails: 3 },
    { name: 'Surge_W_UV_AreaDiff', fails: 0 },
    { name: 'Surge_U_VW_DiffArea', fails: 1 },
    { name: 'Surge_V_WU_DiffArea', fails: 0 },
    { name: 'Surge_W_UV_DiffArea', fails: 2 },
    { name: 'Surge_U_VW_L_Vale', fails: 0 },
    { name: 'Surge_V_WU_L_Vale', fails: 1 },
    { name: 'Surge_W_UV_L_Vale', fails: 0 },
    { name: 'IR_1_UVW_G_NTC', fails: 4 },
    { name: 'IR_2_NTC_G', fails: 0 },
    { name: 'HiPot_1_UVW_G_NTC', fails: 1 },
    { name: 'HiPot_2_NTC_G', fails: 0 },
    { name: 'NTC1_Res', fails: 2 },
    { name: 'NTC2_Res', fails: 0 },
  ],
  'R23': [
    { name: 'Offset_WR_UV_Res', fails: 0 },
    { name: 'Offset_WR_VW_Res', fails: 1 },
    { name: 'Offset_WR_WU_Res', fails: 7 },
    { name: 'Un_UV', fails: 2 },
    { name: 'Un_VW', fails: 0 },
    { name: 'Un_WU', fails: 1 },
    { name: 'Surge_U_VW_AreaDiff', fails: 0 },
    { name: 'Surge_V_WU_AreaDiff', fails: 3 },
    { name: 'Surge_W_UV_AreaDiff', fails: 0 },
    { name: 'Surge_U_VW_DiffArea', fails: 1 },
    { name: 'Surge_V_WU_DiffArea', fails: 0 },
    { name: 'Surge_W_UV_DiffArea', fails: 2 },
    { name: 'Surge_U_VW_L_Vale', fails: 0 },
    { name: 'Surge_V_WU_L_Vale', fails: 1 },
    { name: 'Surge_W_UV_L_Vale', fails: 0 },
    { name: 'IR_1_UVW_G_NTC', fails: 4 },
    { name: 'IR_2_NTC_G', fails: 0 },
    { name: 'HiPot_1_UVW_G_NTC', fails: 1 },
    { name: 'HiPot_2_NTC_G', fails: 0 },
    { name: 'NTC1_Res', fails: 2 },
    { name: 'NTC2_Res', fails: 0 },
  ],
};

export const failedDevicesData: FailedDevicesData = {
  'A26': {
    'Offset_WR_UV_Res': [
      { deviceCode: 'R2S16GK2JCO1', measuredValue: '1.2 Ω', limit: '1.0 Ω', difference: '+0.2 Ω', timestamp: '2024-10-04T09:30:00Z' },
    ],
    'Offset_WR_WU_Res': [
      { deviceCode: 'R2S16GK2JCO2', measuredValue: '1.4 Ω', limit: '1.0 Ω', difference: '+0.4 Ω', timestamp: '2024-10-04T11:00:00Z' },
      { deviceCode: 'R2S16GK2JCO3', measuredValue: '1.5 Ω', limit: '1.0 Ω', difference: '+0.5 Ω', timestamp: '2024-10-04T11:45:00Z' },
    ],
    'Un_VW': [
      { deviceCode: 'R2S16GK2JCO4', measuredValue: '2.2 V', limit: '2.0 V', difference: '+0.2 V', timestamp: '2024-10-04T12:30:00Z' },
      { deviceCode: 'R2S16GK2JCO5', measuredValue: '2.3 V', limit: '2.0 V', difference: '+0.3 V', timestamp: '2024-10-04T13:15:00Z' },
      { deviceCode: 'R2S16GK2JCO6', measuredValue: '2.4 V', limit: '2.0 V', difference: '+0.4 V', timestamp: '2024-10-04T14:00:00Z' },
    ],
    'Un_WU': [
      { deviceCode: 'R2S16GK2JCO7', measuredValue: '2.5 V', limit: '2.0 V', difference: '+0.5 V', timestamp: '2024-10-04T14:45:00Z' },
    ],
    'Surge_V_WU_AreaDiff': [
      { deviceCode: 'R2S16GK2JCO8', measuredValue: '3.1 V', limit: '3.0 V', difference: '+0.1 V', timestamp: '2024-10-04T15:30:00Z' },
      { deviceCode: 'R2S16GK2JCO9', measuredValue: '3.2 V', limit: '3.0 V', difference: '+0.2 V', timestamp: '2024-10-04T16:15:00Z' },
      { deviceCode: 'R2S16GK2JCOA', measuredValue: '3.3 V', limit: '3.0 V', difference: '+0.3 V', timestamp: '2024-10-04T17:00:00Z' },
      { deviceCode: 'R2S16GK2JCOB', measuredValue: '3.4 V', limit: '3.0 V', difference: '+0.4 V', timestamp: '2024-10-04T17:45:00Z' },
    ],
    'Surge_U_VW_DiffArea': [
      { deviceCode: 'R2S16GK2JCOC', measuredValue: '3.5 V', limit: '3.0 V', difference: '+0.5 V', timestamp: '2024-10-04T18:30:00Z' },
    ],
    'Surge_W_UV_DiffArea': [
      { deviceCode: 'R2S16GK2JCOD', measuredValue: '3.6 V', limit: '3.0 V', difference: '+0.6 V', timestamp: '2024-10-04T19:15:00Z' },
      { deviceCode: 'R2S16GK2JCOE', measuredValue: '3.7 V', limit: '3.0 V', difference: '+0.7 V', timestamp: '2024-10-04T20:00:00Z' },
    ],
    'Surge_V_WU_L_Vale': [
      { deviceCode: 'R2S16GK2JCOF', measuredValue: '3.8 V', limit: '3.0 V', difference: '+0.8 V', timestamp: '2024-10-04T20:45:00Z' },
    ],
    'IR_1_UVW_G_NTC': [
      { deviceCode: 'R2S16GK2JCOG', measuredValue: '4.1 V', limit: '4.0 V', difference: '+0.1 V', timestamp: '2024-10-04T21:30:00Z' },
      { deviceCode: 'R2S16GK2JCOH', measuredValue: '4.2 V', limit: '4.0 V', difference: '+0.2 V', timestamp: '2024-10-04T22:15:00Z' },
      { deviceCode: 'R2S16GK2JCOI', measuredValue: '4.3 V', limit: '4.0 V', difference: '+0.3 V', timestamp: '2024-10-04T23:00:00Z' },
    ],
    'HiPot_1_UVW_G_NTC': [
      { deviceCode: 'R2S16GK2JCOJ', measuredValue: '4.4 V', limit: '4.0 V', difference: '+0.4 V', timestamp: '2024-10-04T23:45:00Z' },
    ],
    'NTC1_Res': [
      { deviceCode: 'R2S16GK2JCOK', measuredValue: '4.5 V', limit: '4.0 V', difference: '+0.5 V', timestamp: '2024-10-05T00:30:00Z' },
      { deviceCode: 'R2S16GK2JCOL', measuredValue: '4.6 V', limit: '4.0 V', difference: '+0.6 V', timestamp: '2024-10-05T01:15:00Z' },
    ],
  },
  'S02': {
    'Offset_WR_VW_Res': [
      { deviceCode: 'R2S16GK2JCOM', measuredValue: '1.1 Ω', limit: '1.0 Ω', difference: '+0.1 Ω', timestamp: '2024-10-04T09:00:00Z' },
    ],
    'Un_UV': [
      { deviceCode: 'R2S16GK2JCON', measuredValue: '2.1 V', limit: '2.0 V', difference: '+0.1 V', timestamp: '2024-10-04T10:00:00Z' },
      { deviceCode: 'R2S16GK2JCOO', measuredValue: '2.2 V', limit: '2.0 V', difference: '+0.2 V', timestamp: '2024-10-04T11:00:00Z' },
    ],
    'Un_WU': [
      { deviceCode: 'R2S16GK2JCOP', measuredValue: '2.3 V', limit: '2.0 V', difference: '+0.3 V', timestamp: '2024-10-04T12:00:00Z' },
    ],
    'Surge_V_WU_AreaDiff': [
      { deviceCode: 'R2S16GK2JCOQ', measuredValue: '3.1 V', limit: '3.0 V', difference: '+0.1 V', timestamp: '2024-10-04T13:00:00Z' },
      { deviceCode: 'R2S16GK2JCOR', measuredValue: '3.2 V', limit: '3.0 V', difference: '+0.2 V', timestamp: '2024-10-04T14:00:00Z' },
      { deviceCode: 'R2S16GK2JCOS', measuredValue: '3.3 V', limit: '3.0 V', difference: '+0.3 V', timestamp: '2024-10-04T15:00:00Z' },
    ],
    'Surge_U_VW_DiffArea': [
      { deviceCode: 'R2S16GK2JCOT', measuredValue: '3.4 V', limit: '3.0 V', difference: '+0.4 V', timestamp: '2024-10-04T16:00:00Z' },
    ],
    'Surge_W_UV_DiffArea': [
      { deviceCode: 'R2S16GK2JCOU', measuredValue: '3.5 V', limit: '3.0 V', difference: '+0.5 V', timestamp: '2024-10-04T17:00:00Z' },
      { deviceCode: 'R2S16GK2JCOV', measuredValue: '3.6 V', limit: '3.0 V', difference: '+0.6 V', timestamp: '2024-10-04T18:00:00Z' },
    ],
    'Surge_V_WU_L_Vale': [
      { deviceCode: 'R2S16GK2JCOW', measuredValue: '3.7 V', limit: '3.0 V', difference: '+0.7 V', timestamp: '2024-10-04T19:00:00Z' },
    ],
    'IR_1_UVW_G_NTC': [
      { deviceCode: 'R2S16GK2JCOX', measuredValue: '4.1 V', limit: '4.0 V', difference: '+0.1 V', timestamp: '2024-10-04T20:00:00Z' },
      { deviceCode: 'R2S16GK2JCOY', measuredValue: '4.2 V', limit: '4.0 V', difference: '+0.2 V', timestamp: '2024-10-04T21:00:00Z' },
      { deviceCode: 'R2S16GK2JCOZ', measuredValue: '4.3 V', limit: '4.0 V', difference: '+0.3 V', timestamp: '2024-10-04T22:00:00Z' },
      { deviceCode: 'R2S16GK2JCPA', measuredValue: '4.4 V', limit: '4.0 V', difference: '+0.4 V', timestamp: '2024-10-04T23:00:00Z' },
    ],
    'HiPot_1_UVW_G_NTC': [
      { deviceCode: 'R2S16GK2JCPB', measuredValue: '4.5 V', limit: '4.0 V', difference: '+0.5 V', timestamp: '2024-10-05T00:00:00Z' },
    ],
    'NTC1_Res': [
      { deviceCode: 'R2S16GK2JCPC', measuredValue: '4.6 V', limit: '4.0 V', difference: '+0.6 V', timestamp: '2024-10-05T01:00:00Z' },
      { deviceCode: 'R2S16GK2JCPD', measuredValue: '4.7 V', limit: '4.0 V', difference: '+0.7 V', timestamp: '2024-10-05T02:00:00Z' },
    ],
  },
  'R23': {
    'Offset_WR_VW_Res': [
      { deviceCode: 'R2S16GK2JCOB', measuredValue: '1.2 Ω', limit: '1.0 Ω', difference: '+0.2 Ω', timestamp: '2023-05-10T12:00:00Z' },
    ],
    'Offset_WR_WU_Res': [
      { deviceCode: 'R2S16GK2JCOC', measuredValue: '1.3 Ω', limit: '1.0 Ω', difference: '+0.3 Ω', timestamp: '2023-05-10T12:30:00Z' },
      { deviceCode: 'R2S16GK2JCOD', measuredValue: '1.4 Ω', limit: '1.0 Ω', difference: '+0.4 Ω', timestamp: '2023-05-10T13:00:00Z' },
      { deviceCode: 'R2S16GK2JCOE', measuredValue: '1.5 Ω', limit: '1.0 Ω', difference: '+0.5 Ω', timestamp: '2023-05-10T13:30:00Z' },
      { deviceCode: 'R2S16GK2JCOF', measuredValue: '1.6 Ω', limit: '1.0 Ω', difference: '+0.6 Ω', timestamp: '2023-05-10T14:00:00Z' },
      { deviceCode: 'R2S16GK2JCOG', measuredValue: '1.7 Ω', limit: '1.0 Ω', difference: '+0.7 Ω', timestamp: '2023-05-10T14:30:00Z' },
      { deviceCode: 'R2S16GK2JCOH', measuredValue: '1.8 Ω', limit: '1.0 Ω', difference: '+0.8 Ω', timestamp: '2023-05-10T15:00:00Z' },
      { deviceCode: 'R2S16GK2JCOI', measuredValue: '1.9 Ω', limit: '1.0 Ω', difference: '+0.9 Ω', timestamp: '2023-05-10T15:30:00Z' },
    ],
    'Un_UV': [
      { deviceCode: 'R2S16GK2JCOJ', measuredValue: '2.1 V', limit: '2.0 V', difference: '+0.1 V', timestamp: '2023-05-10T16:00:00Z' },
      { deviceCode: 'R2S16GK2JCOK', measuredValue: '2.2 V', limit: '2.0 V', difference: '+0.2 V', timestamp: '2023-05-10T16:30:00Z' },
    ],
    'Un_WU': [
      { deviceCode: 'R2S16GK2JCOL', measuredValue: '2.3 V', limit: '2.0 V', difference: '+0.3 V', timestamp: '2023-05-10T17:00:00Z' },
    ],
    'Surge_V_WU_AreaDiff': [
      { deviceCode: 'R2S16GK2JCOM', measuredValue: '3.1 V', limit: '3.0 V', difference: '+0.1 V', timestamp: '2023-05-10T17:30:00Z' },
      { deviceCode: 'R2S16GK2JCON', measuredValue: '3.2 V', limit: '3.0 V', difference: '+0.2 V', timestamp: '2023-05-10T18:00:00Z' },
      { deviceCode: 'R2S16GK2JCOO', measuredValue: '3.3 V', limit: '3.0 V', difference: '+0.3 V', timestamp: '2023-05-10T18:30:00Z' },
    ],
    'Surge_W_UV_DiffArea': [
      { deviceCode: 'R2S16GK2JCOP', measuredValue: '4.1 V', limit: '4.0 V', difference: '+0.1 V', timestamp: '2023-05-10T19:00:00Z' },
      { deviceCode: 'R2S16GK2JCOQ', measuredValue: '4.2 V', limit: '4.0 V', difference: '+0.2 V', timestamp: '2023-05-10T19:30:00Z' },
    ],
    'Surge_V_WU_L_Vale': [
      { deviceCode: 'R2S16GK2JCOR', measuredValue: '5.1 V', limit: '5.0 V', difference: '+0.1 V', timestamp: '2023-05-10T20:00:00Z' },
    ],
    'IR_1_UVW_G_NTC': [
      { deviceCode: 'R2S16GK2JCOS', measuredValue: '6.1 V', limit: '6.0 V', difference: '+0.1 V', timestamp: '2023-05-10T20:30:00Z' },
      { deviceCode: 'R2S16GK2JCOT', measuredValue: '6.2 V', limit: '6.0 V', difference: '+0.2 V', timestamp: '2023-05-10T21:00:00Z' },
      { deviceCode: 'R2S16GK2JCOU', measuredValue: '6.3 V', limit: '6.0 V', difference: '+0.3 V', timestamp: '2023-05-10T21:30:00Z' },
      { deviceCode: 'R2S16GK2JCOV', measuredValue: '6.4 V', limit: '6.0 V', difference: '+0.4 V', timestamp: '2023-05-10T22:00:00Z' },
    ],
    'HiPot_1_UVW_G_NTC': [
      { deviceCode: 'R2S16GK2JCOW', measuredValue: '7.1 V', limit: '7.0 V', difference: '+0.1 V', timestamp: '2023-05-10T22:30:00Z' },
    ],
    'NTC1_Res': [
      { deviceCode: 'R2S16GK2JCOX', measuredValue: '8.1 Ω', limit: '8.0 Ω', difference: '+0.1 Ω', timestamp: '2023-05-10T23:00:00Z' },
      { deviceCode: 'R2S16GK2JCOY', measuredValue: '8.2 Ω', limit: '8.0 Ω', difference: '+0.2 Ω', timestamp: '2023-05-10T23:30:00Z' },
    ],
  },
};

export const deviceData: Device = {
  code: 'R2S16GK2JCO1',
  type: 'EFAD',
  currentStation: 'A26',
  stations: [
    {
      name: 'A20',
      status: 'passed',
      tests: [
        { name: 'Offset WR UV Resistance', result: 'passed', measuredValue: '0.5 Ω' },
        { name: 'Offset WR VW Resistance', result: 'passed', measuredValue: '0.3 Ω' },
        { name: 'Offset WR WU Resistance', result: 'passed', measuredValue: '0.7 Ω' },
        { name: 'Unbalance UV', result: 'passed', measuredValue: '0.1 %' },
        { name: 'Unbalance VW', result: 'passed', measuredValue: '0.2 %' },
        { name: 'Unbalance WU', result: 'passed', measuredValue: '0.4 %' },
        { name: 'Surge UV VW Area Difference', result: 'passed', measuredValue: '0.6 mm²' },
        { name: 'Surge VW WU Area Difference', result: 'passed', measuredValue: '0.8 mm²' },
        { name: 'Surge WU UV Area Difference', result: 'passed', measuredValue: '0.9 mm²' },
        { name: 'Surge UV VW Difference Area', result: 'passed', measuredValue: '0.5 mm²' },
        { name: 'Surge VW WU Difference Area', result: 'passed', measuredValue: '0.3 mm²' },
        { name: 'Surge WU UV Difference Area', result: 'passed', measuredValue: '0.7 mm²' },
        { name: 'Surge UV VW L Value', result: 'passed', measuredValue: '0.1 H' },
        { name: 'Surge VW WU L Value', result: 'passed', measuredValue: '0.2 H' },
        { name: 'Surge WU UV L Value', result: 'passed', measuredValue: '0.4 H' },
        { name: 'IR 1 UVW G NTC', result: 'passed', measuredValue: '0.6 MΩ' },
        { name: 'IR 2 NTC G', result: 'passed', measuredValue: '0.8 MΩ' },
        { name: 'HiPot 1 UVW G NTC', result: 'passed', measuredValue: '0.9 kV' },
        { name: 'HiPot 2 NTC G', result: 'passed', measuredValue: '0.5 kV' },
        { name: 'NTC1 Resistance', result: 'passed', measuredValue: '0.3 Ω' },
        { name: 'NTC2 Resistance', result: 'passed', measuredValue: '0.7 Ω' },
      ],
    },
    {
      name: 'A25',
      status: 'failed',
      tests: [
        { name: 'Offset WR UV Resistance', result: 'passed', measuredValue: '0.5 Ω' },
        { name: 'Offset WR VW Resistance', result: 'failed', measuredValue: '1.2 Ω', offsetFromLimit: '+0.7 Ω' },
        { name: 'Offset WR WU Resistance', result: 'passed', measuredValue: '0.7 Ω' },
        { name: 'Unbalance UV', result: 'failed', measuredValue: '1.5 %', offsetFromLimit: '+1.0 %' },
        { name: 'Unbalance VW', result: 'passed', measuredValue: '0.2 %' },
        { name: 'Unbalance WU', result: 'failed', measuredValue: '2.0 %', offsetFromLimit: '+1.5 %' },
        { name: 'Surge UV VW Area Difference', result: 'passed', measuredValue: '0.6 mm²' },
        { name: 'Surge VW WU Area Difference', result: 'failed', measuredValue: '1.1 mm²', offsetFromLimit: '+0.3 mm²' },
        { name: 'Surge WU UV Area Difference', result: 'passed', measuredValue: '0.9 mm²' },
        { name: 'Surge UV VW Difference Area', result: 'passed', measuredValue: '0.5 mm²' },
        { name: 'Surge VW WU Difference Area', result: 'passed', measuredValue: '0.3 mm²' },
        { name: 'Surge WU UV Difference Area', result: 'passed', measuredValue: '0.7 mm²' },
        { name: 'Surge UV VW L Value', result: 'passed', measuredValue: '0.1 H' },
        { name: 'Surge VW WU L Value', result: 'passed', measuredValue: '0.2 H' },
        { name: 'Surge WU UV L Value', result: 'passed', measuredValue: '0.4 H' },
        { name: 'IR 1 UVW G NTC', result: 'passed', measuredValue: '0.6 MΩ' },
        { name: 'IR 2 NTC G', result: 'passed', measuredValue: '0.8 MΩ' },
        { name: 'HiPot 1 UVW G NTC', result: 'passed', measuredValue: '0.9 kV' },
        { name: 'HiPot 2 NTC G', result: 'passed', measuredValue: '0.5 kV' },
        { name: 'NTC1 Resistance', result: 'passed', measuredValue: '0.3 Ω' },
        { name: 'NTC2 Resistance', result: 'passed', measuredValue: '0.7 Ω' },
      ],
    },
    {
      name: 'A26',
      status: 'in-progress',
      tests: [
        { name: 'Offset WR UV Resistance', result: 'in-progress' },
        { name: 'Offset WR VW Resistance', result: 'in-progress' },
        { name: 'Offset WR WU Resistance', result: 'in-progress' },
        { name: 'Unbalance UV', result: 'in-progress' },
        { name: 'Unbalance VW', result: 'in-progress' },
        { name: 'Unbalance WU', result: 'in-progress' },
        { name: 'Surge UV VW Area Difference', result: 'in-progress' },
        { name: 'Surge VW WU Area Difference', result: 'in-progress' },
        { name: 'Surge WU UV Area Difference', result: 'in-progress' },
        { name: 'Surge UV VW Difference Area', result: 'in-progress' },
        { name: 'Surge VW WU Difference Area', result: 'in-progress' },
        { name: 'Surge WU UV Difference Area', result: 'in-progress' },
        { name: 'Surge UV VW L Value', result: 'in-progress' },
        { name: 'Surge VW WU L Value', result: 'in-progress' },
        { name: 'Surge WU UV L Value', result: 'in-progress' },
        { name: 'IR 1 UVW G NTC', result: 'in-progress' },
        { name: 'IR 2 NTC G', result: 'in-progress' },
        { name: 'HiPot 1 UVW G NTC', result: 'in-progress' },
        { name: 'HiPot 2 NTC G', result: 'in-progress' },
        { name: 'NTC1 Resistance', result: 'in-progress' },
        { name: 'NTC2 Resistance', result: 'in-progress' },
      ],
    },
    {
      name: 'S02',
      status: 'pending',
      tests: [
        { name: 'Offset WR UV Resistance', result: 'pending' },
        { name: 'Offset WR VW Resistance', result: 'pending' },
        { name: 'Offset WR WU Resistance', result: 'pending' },
        { name: 'Unbalance UV', result: 'pending' },
        { name: 'Unbalance VW', result: 'pending' },
        { name: 'Unbalance WU', result: 'pending' },
        { name: 'Surge UV VW Area Difference', result: 'pending' },
        { name: 'Surge VW WU Area Difference', result: 'pending' },
        { name: 'Surge WU UV Area Difference', result: 'pending' },
        { name: 'Surge UV VW Difference Area', result: 'pending' },
        { name: 'Surge VW WU Difference Area', result: 'pending' },
        { name: 'Surge WU UV Difference Area', result: 'pending' },
        { name: 'Surge UV VW L Value', result: 'pending' },
        { name: 'Surge VW WU L Value', result: 'pending' },
        { name: 'Surge WU UV L Value', result: 'pending' },
        { name: 'IR 1 UVW G NTC', result: 'pending' },
        { name: 'IR 2 NTC G', result: 'pending' },
        { name: 'HiPot 1 UVW G NTC', result: 'pending' },
        { name: 'HiPot 2 NTC G', result: 'pending' },
        { name: 'NTC1 Resistance', result: 'pending' },
        { name: 'NTC2 Resistance', result: 'pending' },
      ],
    },
    {
      name: 'NVH',
      status: 'pending',
      tests: [
        { name: 'Noise Vibration Harshness', result: 'pending' },
      ],
    },
    {
      name: 'R23',
      status: 'pending',
      tests: [
        { name: 'Assembly Line Check', result: 'pending' },
      ],
    }
  ],
}