"use client"

import React, { useMemo, useState, useEffect, useRef } from 'react';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { pb } from "@/lib/pocketbase_connect";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
type Station = keyof typeof STATIONS;
interface DataPoint {
  time: string;
  [key: string]: any;
}

// Constants
const STATIONS = {
  station_a20: 'A20',
  station_a25: 'A25',
  station_a26: 'A26',
  station_nvh: 'NVH',
  station_s02: 'S02',
  station_r23: 'R23'
} as const;

const EXCLUDED_FIELDS = [
  'time',
  'id',
  'created',
  'updated',
  'collectionId',
  'collectionName',
  'device_code',
  'motor_type',
  'test_fail'
];

const getAvailableTests = async (station: Station): Promise<string[]> => {
  try {
    const record = await pb.collection(station).getFirstListItem('');
    return Object.keys(record).filter(key => !EXCLUDED_FIELDS.includes(key));
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
};

const generateData = async (
  station: Station,
  test: string,
  startDate: Date,
  endDate: Date
): Promise<[number[], number[]]> => {
  try {
    const records = await pb.collection(station).getFullList<DataPoint>({
      filter: `time>="${startDate.toISOString().split('T')[0]} 00:00:00" && time<="${endDate.toISOString().split('T')[0]} 23:59:59"`,
      fields: `time,${test}`,
    });

    if (!records.length) {
      return [[], []];
    }

    const timestamps: number[] = [];
    const values: number[] = [];

    records.forEach(record => {
      timestamps.push(new Date(record.time).getTime() / 1000);
      values.push(record[test]);
    });

    return [timestamps, values];
  } catch (error) {
    console.error('Error generating data:', error);
    return [[], []];
  }
};

export function TestingUplot() {
  const [selectedStation, setSelectedStation] = useState<Station>('station_s02');
  const [availableTests, setAvailableTests] = useState<string[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [data, setData] = useState<[number[], number[]]>([[], []]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const upperLimit = 8; // Replace with your actual upper limit value
  const lowerLimit = 2;

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const currentDate = new Date();
    const lastWeekStart = startOfWeek(subWeeks(currentDate, 1));
    const lastWeekEnd = endOfWeek(subWeeks(currentDate, 1));
    return {
      from: lastWeekStart,
      to: lastWeekEnd,
    };
  });

  // Fetch available tests when station changes
  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const tests = await getAvailableTests(selectedStation);
        setAvailableTests(tests);
        if (tests.length > 0 && !tests.includes(selectedTest)) {
          setSelectedTest(tests[0]);
        }
      } catch (error) {
        setError('Failed to fetch available tests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [selectedStation]);

  // Fetch data when parameters change
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTest || !dateRange?.from || !dateRange?.to) return;

      setIsLoading(true);
      setError(null);
      try {
        const chartData = await generateData(selectedStation, selectedTest, dateRange.from, dateRange.to);
        setData(chartData);
        if (chartData[0].length === 0) {
          setError('No data available for the selected parameters');
        }
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStation, selectedTest, dateRange]);

  const options = useMemo(() => ({
    title: `${STATIONS[selectedStation]} - ${selectedTest}`,
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
        value: (self: any, rawValue: number) => rawValue ? `${rawValue}` : "--",
        scale: selectedTest,
        points: { show: false } // Hide the dots
      },
      {
        show: true,
        spanGaps: true,
        label: "Upper Limit",
        stroke: "red",
        width: 1,
        dash: [5, 5],
        scale: selectedTest,
        points: { show: false } // Hide the dots
      },
      {
        show: true,
        spanGaps: true,
        label: "Lower Limit",
        stroke: "blue",
        width: 1,
        dash: [5, 5],
        scale: selectedTest,
        points: { show: false } // Hide the dots
      }
    ],
    scales: {
      x: {
        time: true
      },
      selectedTest: {
        auto: true,
        side: 3
      }
    },
    axes: [
      {
        scale: "x",
        values: (self: any, ticks: number[]) => ticks.map(v => new Date(v * 1000).toLocaleDateString()),
        space: 80,
        grid: { show: true, stroke: "#e0e0e0", width: 1, dash: [5, 5] },
        ticks: { show: true, size: 10, stroke: "#000", width: 1 },
        side: 2,
        label: "Date"
      },
      {
        scale: selectedTest,
        values: (self: any, ticks: number[]) => ticks.map(v => `${v} V`),
        grid: { show: true, stroke: "#e0e0e0", width: 1, dash: [5, 5] },
        ticks: { show: true, size: 10, stroke: "#000", width: 1 },
        side: 3,
        label: selectedTest
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
              {dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}`
                : 'Select a date range'
              }
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedStation}
              onValueChange={(station) => {
                setSelectedStation(station as Station);
                setSelectedTest('');
                setError(null);
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
              onValueChange={(test) => {
                setSelectedTest(test);
                setError(null);
              }}
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from && dateRange?.to ? (
                    `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}`
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full my-4" ref={chartContainerRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <UplotReact
            options={options}
            data={[
              data[0], // timestamps
              data[1], // values
              Array(data[0].length).fill(upperLimit), // upper limit line
              Array(data[0].length).fill(lowerLimit)  // lower limit line
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
}