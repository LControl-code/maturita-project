"use client"
import React, { useMemo, useState, useEffect, useRef } from 'react';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pb } from "@/lib/pocketbase_connect";

// Define available stations
const STATIONS = {
  station_a20: 'A20',
  station_a25: 'A25',
  station_a26: 'A26',
  station_nvh: 'NVH',
  station_s02: 'S02',
  station_r23: 'R23'
};

const getAvailableTests = async (station: string): Promise<string[]> => {
  try {
    // Get a single record to examine its structure
    const record = await pb.collection(station).getFirstListItem('');

    // Filter out common fields that shouldn't be treated as tests
    const excludedFields = ['time', 'id', 'created', 'updated', 'collectionId', 'collectionName', 'device_code', 'motor_type', 'test_fail'];
    const tests = Object.keys(record).filter(key => !excludedFields.includes(key));

    return tests;
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
};

const generateData = async (
  station: string,
  test: string,
  startDate: Date,
  endDate: Date
): Promise<[number[], number[]]> => {
  const records = await pb.collection(station).getFullList({
    filter: `time>="${startDate.toISOString().split('T')[0]} 00:00:00" && time<="${endDate.toISOString().split('T')[0]} 23:59:59"`,
    fields: `time, ${test}`,
  });

  const timestamps: number[] = [];
  const values: number[] = [];

  records.forEach(record => {
    timestamps.push(new Date(record.time).getTime() / 1000);
    values.push(record[test]);
  });

  return [timestamps, values];
};

export function TestingUplot() {
  const [selectedStation, setSelectedStation] = useState('station_s02');
  const [availableTests, setAvailableTests] = useState<string[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [data, setData] = useState<[number[], number[]]>([[], []]);
  const [isLoading, setIsLoading] = useState(true);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Fetch available tests when station changes
  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      const tests = await getAvailableTests(selectedStation);
      setAvailableTests(tests);

      // Set the first test as selected by default
      if (tests.length > 0 && !tests.includes(selectedTest)) {
        setSelectedTest(tests[0]);
      }
      setIsLoading(false);
    };

    fetchTests();
  }, [selectedStation]);

  // Fetch data when station or test changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTest) return;

      setIsLoading(true);
      try {
        const startDate = new Date("2024-10-20");
        const endDate = new Date("2024-10-27");
        const chartData = await generateData(selectedStation, selectedTest, startDate, endDate);
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStation, selectedTest]);

  const options = useMemo(() => ({
    title: `${STATIONS[selectedStation as keyof typeof STATIONS]} - ${selectedTest}`,
    width: chartContainerRef.current ? chartContainerRef.current.offsetWidth - 50 : 800,
    height: 400,
    series: [
      {},
      {
        show: true,
        spanGaps: true,
        label: selectedTest,
        stroke: "orange",
        width: 2,
        value: (self: any, rawValue: number) => rawValue + " V",
        scale: "Voltage"
      }
    ],
    scales: {
      x: {
        time: true
      },
      Voltage: {
        auto: true,
        side: 3
      }
    },
    axes: [
      {
        scale: "x",
        values: (self: any, ticks: number[]) => ticks.map(v => new Date(v * 1000).toLocaleDateString()),
        space: 80,
        grid: {
          show: true,
          stroke: "#e0e0e0",
          width: 1,
          dash: [5, 5]
        },
        ticks: {
          show: true,
          size: 10,
          stroke: "#000",
          width: 1
        },
        side: 2,
        label: "Date"
      },
      {
        scale: "Voltage",
        values: (self: any, ticks: number[]) => ticks.map(v => v + " V"),
        grid: {
          show: true,
          stroke: "#e0e0e0",
          width: 1,
          dash: [5, 5]
        },
        ticks: {
          show: true,
          size: 10,
          stroke: "#000",
          width: 1
        },
        side: 3,
        label: "Voltage (V)"
      }
    ],
    cursor: {
      drag: {
        x: true,
        y: false
      }
    }
  }), [selectedStation, selectedTest, chartContainerRef.current]);

  return (
    <Card className="w-full rounded">
      <CardHeader className="flex flex-col gap-4 border-b">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1">
            <CardTitle>Time Series Chart</CardTitle>
            <CardDescription>
              {data[0].length > 0
                ? `${new Date(data[0][0] * 1000).toLocaleString()} - ${new Date(data[0][data[0].length - 1] * 1000).toLocaleString()}`
                : 'Loading...'
              }
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedStation}
              onValueChange={(station) => {
                setSelectedStation(station);
                setSelectedTest(''); // Reset selected test when station changes
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATIONS).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedTest}
              onValueChange={setSelectedTest}
              disabled={availableTests.length === 0}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select test" />
              </SelectTrigger>
              <SelectContent>
                {availableTests.map((test) => (
                  <SelectItem key={test} value={test}>
                    {test}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full my-4" ref={chartContainerRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            Loading...
          </div>
        ) : (
          <UplotReact
            options={options}
            data={data}
          />
        )}
      </CardContent>
    </Card>
  );
}