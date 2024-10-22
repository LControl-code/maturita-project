import { FailsData, TestRecord } from "@/types/api";
import { trackDevice, trackStation, trackTest } from '@/types/device';

import PocketBase from "pocketbase";

// Initialize client
export const pb = new PocketBase("http://127.0.0.1:8090");

pb.autoCancellation(false);

pb.authStore.onChange(() => {
  console.log("Auth state changed");
});

const collections = ['station_a20', 'station_a25', 'station_a26', 'station_s02', 'station_nvh', 'station_r23'];

interface BaseRecord {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;
  time?: string;
  test_fail?: boolean;
  device_code?: string;
  motor_type?: string;
  [key: string]: number | string | boolean | undefined;
}

interface Record extends BaseRecord {
  [key: string]: number | string | boolean | undefined;
}

interface RecordsByStation {
  count: number;
  records: Record[];
  testFailures: { [test: string]: number };
}

export async function getStationData() {
  const records = await pb.collection('station_s02').getList(1, 20, {
    sort: '-created',
  });
  return records.items;
}

export async function getLimitsForMotorType(motorType?: 'EFAD' | 'ERAD' | 'Short') {
  const limitsByStation: { [key: string]: Record[] } = {};

  for (const collection of collections) {
    const limitsCollection = `${collection}_limits`;
    const filter = motorType ? `motor_type='${motorType}'` : '';
    const limits: Record[] = await pb.collection(limitsCollection).getFullList({
      filter,
      cache: 'no-store',
    });

    limitsByStation[collection] = limits;
  }

  return limitsByStation;
}

export async function getTopFailsData() {
  const recordsByStation: { [key: string]: RecordsByStation } = {};
  const limitsByStation: { [key: string]: Record[] } = await getLimitsForMotorType('EFAD');

  const today = new Date().toISOString().split('T')[0];

  for (const collection of collections) {
    const records: Record[] = await pb.collection(collection).getFullList({
      sort: '-created',
      filter: `test_fail=true && time>='${today} 00:00:00' && time<='${today} 23:59:59'`,
    });

    // Filter records and delete specified attributes
    const filteredRecords = records.map(record => {
      const filteredRecord: Record = { ...record };

      delete filteredRecord.id;
      delete filteredRecord.collectionId;
      delete filteredRecord.collectionName;
      delete filteredRecord.created;
      delete filteredRecord.updated;
      delete filteredRecord.test_fail;
      delete filteredRecord.motor_type;

      // Filter out tests that are within the limits
      Object.keys(filteredRecord).forEach(test => {
        const value = record[test];
        if (typeof value === 'number') {
          const limits = limitsByStation[collection]?.[0];
          if (limits) {
            const min = limits[`${test}_MIN`] as number;
            const max = limits[`${test}_MAX`] as number;
            if (min !== undefined && max !== undefined && value >= min && value <= max) {
              delete filteredRecord[test];
            }
          }
        }
      });

      return filteredRecord;
    });

    // Count test failures
    const testFailures: { [test: string]: number } = {};
    filteredRecords.forEach(record => {
      Object.keys(record).forEach(test => {
        if (test !== 'device_code' && test !== 'time') {
          const limits = limitsByStation[collection]?.[0];
          if (limits) {
            const minKey = `${test}_MIN`;
            const maxKey = `${test}_MAX`;
            if (minKey in limits || maxKey in limits) {
              testFailures[test] = (testFailures[test] || 0) + 1;
            }
          }
        }
      });
    });

    recordsByStation[collection] = {
      count: filteredRecords.length,
      records: filteredRecords,
      testFailures: testFailures,
    };
  }

  // Sort stations by the number of failed devices and select the top three
  const topStations = Object.entries(recordsByStation)
    .sort(([, a], [, b]) => b.count - a.count)
    .reduce((acc, [station, data]) => {
      if (data.count === 0) return acc;

      // Get top 3 tests with the highest failure counts
      const topTests = Object.entries(data.testFailures)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([test, count]) => ({ name: test, count }));

      const stationName = station.split('_')[1].toUpperCase();

      acc[stationName] = {
        value: data.count,
        topTests: topTests,
      };
      return acc;
    }, {} as { [key: string]: { value: number, topTests: { name: string, count: number }[] } });

  return { 'Top Fails': topStations };
}

export async function getFailedTestsGraphData() {
  const recordsByStation: { [key: string]: Record[] } = {};
  const limitsByStation: { [key: string]: Record[] } = {};
  const today = new Date().toISOString().split('T')[0];

  // Fetch limits for each station first
  for (const collection of collections) {
    const limitsCollection = `${collection}_limits`;
    const limits: Record[] = await pb.collection(limitsCollection).getFullList({
      filter: `motor_type='EFAD'`,
      cache: 'no-store',
    });
    limitsByStation[collection] = limits;
  }

  // Fetch records and filter based on limits
  for (const collection of collections) {
    const records: Record[] = await pb.collection(collection).getFullList({
      sort: '-created',
      filter: `test_fail=true && time>='${today} 00:00:00' && time<='${today} 23:59:59'`,
    });

    const filteredRecords = records
      .map(record => {
        const filteredRecord: Record = { ...record };
        const limits = limitsByStation[collection][0];

        // Remove standard fields
        ['id', 'collectionId', 'collectionName', 'created', 'updated', 'test_fail', 'motor_type'].forEach(field => {
          delete filteredRecord[field];
        });

        // Filter out tests within limits
        Object.keys(filteredRecord).forEach(test => {
          const value = record[test];
          if (typeof value === 'number') {
            const min = limits[`${test}_MIN`] as number | undefined;
            const max = limits[`${test}_MAX`] as number | undefined;
            if (min !== undefined && max !== undefined && value >= min && value <= max) {
              delete filteredRecord[test];
            }
          }
        });

        return filteredRecord;
      })
      .filter(record => Object.keys(record).length > 0);

    recordsByStation[collection] = filteredRecords;
  }

  const transformedData: { [key: string]: { [test: string]: TestRecord[] } } = {};

  for (const [collection, records] of Object.entries(recordsByStation)) {
    const stationName = collection.split('_')[1].toUpperCase();
    transformedData[stationName] = {};

    records.forEach(record => {
      const deviceCode = record.device_code;
      const timestamp = record.time;

      if (deviceCode && timestamp) {
        Object.entries(record).forEach(([test, value]) => {
          if (test !== 'device_code' && test !== 'time' && typeof value === 'number') {
            const limits = limitsByStation[collection][0];
            const min = limits[`${test}_MIN`] as number;
            const max = limits[`${test}_MAX`] as number;
            const limit = value < min ? min : max;
            const difference = parseFloat((value - limit).toFixed(3));

            if (!transformedData[stationName][test]) {
              transformedData[stationName][test] = [];
            }

            transformedData[stationName][test].push({
              deviceCode,
              measuredValue: value,
              limit,
              difference,
              timestamp,
            });
          }
        });
      }
    });
  }

  // Clean and sort data
  const cleanedData = Object.fromEntries(
    Object.entries(transformedData).filter(([, tests]) => Object.keys(tests).length > 0)
  );

  const sortedData = Object.fromEntries(
    Object.entries(cleanedData).sort(([, a], [, b]) => {
      const countA = Object.values(a).reduce((sum, tests) => sum + tests.length, 0);
      const countB = Object.values(b).reduce((sum, tests) => sum + tests.length, 0);
      return countB - countA;
    })
  );

  return sortedData as FailsData;
}

export async function getDeviceData(deviceCode: string): Promise<trackDevice> {
  const decodedDeviceCode = decodeURIComponent(deviceCode);
  const deviceDataByStation: { [key: string]: Record | null } = {};
  const stations: trackStation[] = [];
  let motorType = '';
  let currentStation = '';

  // Get all station limits first
  const limitsByStation: { [key: string]: Record[] } = {};
  for (const collection of collections) {
    const limitsCollection = `${collection}_limits`;
    const limits: Record[] = await pb.collection(limitsCollection).getFullList({
      filter: `motor_type='EFAD'`,
      cache: 'no-store',
    });
    limitsByStation[collection] = limits;
  }

  for (const collection of collections) {
    const records: Record[] = await pb.collection(collection).getFullList({
      filter: `device_code='${decodedDeviceCode}'`,
      cache: 'no-store',
    });

    if (records.length === 0) {
      deviceDataByStation[collection] = null;
      continue;
    }

    const record = records[0];
    motorType = record.motor_type || motorType;
    currentStation = collection.split('_')[1].toUpperCase();

    const tests: trackTest[] = Object.keys(record)
      .filter(key => !['id', 'collectionId', 'collectionName', 'created', 'updated', 'motor_type', 'device_code', 'time', 'test_fail'].includes(key))
      .map(key => {
        const value = record[key] as number;
        const limits = limitsByStation[collection][0];
        const min = limits[`${key}_MIN`] as number;
        const max = limits[`${key}_MAX`] as number;

        let testResult: 'passed' | 'failed' = 'passed';
        let offsetFromLimit: string | undefined = undefined;

        if (value !== undefined && (min !== undefined || max !== undefined)) {
          if (min !== undefined && value < min) {
            testResult = 'failed';
            offsetFromLimit = `${(value - min).toFixed(3)}`;
          } else if (max !== undefined && value > max) {
            testResult = 'failed';
            offsetFromLimit = `+${(value - max).toFixed(3)}`;
          }
        }

        const test: trackTest = {
          name: key,
          result: testResult,
          measuredValue: `${value}`
        };

        // Only add offsetFromLimit if the test failed
        if (testResult === 'failed' && offsetFromLimit !== undefined) {
          test.offsetFromLimit = offsetFromLimit;
        }

        return test;
      });

    // A station is failed if any of its tests failed
    const stationStatus = tests.some(test => test.result === 'failed') ? 'failed' : 'passed';

    const station: trackStation = {
      name: currentStation,
      status: stationStatus,
      tests
    };

    stations.push(station);
  }

  const deviceData: trackDevice = {
    code: decodedDeviceCode,
    type: motorType,
    currentStation,
    stations
  };

  return deviceData;
}