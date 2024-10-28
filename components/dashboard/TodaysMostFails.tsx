"use client"
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { FailsData, StationData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, Pie, Cell, Tooltip, Legend, PieChart } from 'recharts';
import { useSubscription } from '@/context/SubscriptionContext';


interface TodaysMostFailsProps {
  initialData: FailsData;
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: StationData
  }>
  label?: string
}

const fetchTopFailsData = async (): Promise<FailsData> => {
  const response = await fetch('/api/data/tests/top', {
    // cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return await response.json();
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const TodaysMostFails: React.FC<TodaysMostFailsProps> = ({ initialData }) => {
  const [dataType, setDataType] = useState('Top Fails');
  const [selectedStation, setSelectedStation] = useState('All');
  const [failsData, setFailsData] = useState<FailsData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUpdate = useSubscription();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching top fails data...');
      const fetchedData = await fetchTopFailsData();
      if (fetchedData.error === "Failed to fetch top fails data" && fetchedData.message.includes("autocancelled")) {
        console.log('Request was auto-cancelled, using old data.');
        setFailsData(failsData);
      } else {
        console.log('Fetched: ', fetchedData);
        setFailsData(fetchedData);
        setError(null);
      }
    } catch {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [failsData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (lastUpdate) {
        fetchData();
      }
    }, 5000);

    return () => {
      clearTimeout(handler);
    };
  }, [lastUpdate]);

  const stationNames = useMemo(() => {
    if (!failsData || !failsData[dataType]) return [];
    return Object.keys(failsData[dataType as keyof FailsData]);
  }, [failsData, dataType]);

  useEffect(() => {
    if (stationNames.length > 0 && !stationNames.includes(selectedStation)) {
      setSelectedStation('All');
    }
  }, [stationNames, selectedStation]);

  const filteredData = useMemo(() => {
    if (!failsData) return [];
    if (dataType === 'Top Fails') {
      if (selectedStation === 'All') {
        return Object.entries(failsData['Top Fails']).map(([name, data]) => ({ ...data, name }));
      } else {
        const stationData = failsData['Top Fails'][selectedStation];
        return stationData?.topTests.map(test => ({ name: test.name, value: test.count })) || [];
      }
    } else {
      if (selectedStation === 'All') {
        return Object.entries(failsData['Issue Count']).flatMap(([station, data]) => [
          { name: `${station} Material`, value: data.material },
          { name: `${station} Tester`, value: data.tester }
        ]);
      } else {
        const stationData = failsData['Issue Count'][selectedStation];
        return stationData ? [
          { name: 'Material', value: stationData.material },
          { name: 'Tester', value: stationData.tester }
        ] : [];
      }
    }
  }, [failsData, dataType, selectedStation]);

  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data: StationData = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-4 rounded shadow">
          <p className="font-semibold">{data.name}</p>
          <p>Value: {data.value}</p>
          {dataType === 'Top Fails' && selectedStation === 'All' && data.topTests && (
            <>
              <p className="mt-2 font-semibold">Top 3 Failed Tests:</p>
              <ul className="list-disc pl-4">
                {data.topTests.map((test, index) => (
                  <li key={index}>
                    {test.name}: {test.count}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col h-full"
    >
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Today&apos;s Most {dataType}</span>
            <Badge variant="secondary">{totalValue} Total</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Top Fails">Top Fails</SelectItem>
                <SelectItem value="Issue Count">Material & Tester Issues</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger>
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stations</SelectItem>
                {stationNames.map(station => (
                  <SelectItem key={station} value={station}>{station}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-grow relative">
            <AnimatePresence>
              {loading && !failsData ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <p className="text-gray-500">Loading...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center text-red-500">
                    <AlertCircle className="mx-auto h-12 w-12 mb-2" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              ) : filteredData.length === 0 ? (
                <motion.div
                  key="no-data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <p className="text-gray-500">No data available for this day</p>
                </motion.div>
              ) : (
                <motion.div
                  key="chart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="70%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {filteredData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TodaysMostFails;