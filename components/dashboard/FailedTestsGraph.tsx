"use client"
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Table } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Cell, BarChart } from 'recharts';
import { FailsData, TestRecord } from '@/types/api';
import { useSubscription } from '@/context/SubscriptionContext';
import Link from 'next/link';

interface FailedTestsGraphProps {
  initialData: FailsData;
}

const ITEMS_PER_PAGE = 10;

const fetchTopFailsData = async (): Promise<FailsData> => {
  const response = await fetch('/api/data/graph-fails', {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

const FailedTestsGraph: React.FC<FailedTestsGraphProps> = ({ initialData }) => {
  const [data, setData] = useState<FailsData>(initialData);
  const [selectedStation, setSelectedStation] = useState<string>(() => Object.keys(initialData)[0]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const lastUpdate = useSubscription();
  const prevLastUpdateRef = useRef(lastUpdate);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`[${new Date().toISOString()}] fetchData: Fetching data`);
      const fetchedData = await fetchTopFailsData();
      console.log('Fetched: ', fetchedData);
      setData(fetchedData);

      setSelectedStation(prevStation => {
        return fetchedData[prevStation] ? prevStation : Object.keys(fetchedData)[0];
      });

      setSelectedTest(prevTest => {
        return prevTest && fetchedData[selectedStation]?.[prevTest] ? prevTest : null;
      });

      setError(null);
    } catch {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedStation]);

  useEffect(() => {
    if (lastUpdate && lastUpdate !== prevLastUpdateRef.current) {
      prevLastUpdateRef.current = lastUpdate;
      const handler = setTimeout(fetchData, 5000);
      return () => clearTimeout(handler);
    }
  }, [lastUpdate, fetchData]);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleStationChange = useCallback((station: string) => {
    setSelectedStation(station);
    setSelectedTest(null);
    setCurrentPage(1);
  }, []);

  const handleBarClick = useCallback((data: { name: string }) => {
    setSelectedTest(data.name);
    setCurrentPage(1);
  }, []);

  const sortedDataArray = useMemo(() => {
    if (!data || !data[selectedStation]) return [];
    return Object.entries(data[selectedStation])
      .map(([name, records]) => ({
        name,
        fails: records.length,
      }))
      .filter(test => test.fails > 0)
      .sort((a, b) => b.fails - a.fails);
  }, [data, selectedStation]);

  const { totalFails, mostCriticalTest, maxFails } = useMemo(() => {
    const totalFails = sortedDataArray.reduce((sum, test) => sum + test.fails, 0);
    const mostCriticalTest = sortedDataArray[0];
    const maxFails = Math.max(...sortedDataArray.map(item => item.fails), 0);
    return { totalFails, mostCriticalTest, maxFails };
  }, [sortedDataArray]);

  const getBarColor = useCallback((fails: number) => {
    if (fails >= 30) return '#7f1d1d';
    if (fails >= 25) return '#991b1b';
    if (fails >= 20) return '#b91c1c';
    if (fails >= 15) return '#dc2626';
    if (fails >= 10) return '#ef4444';
    if (fails >= 8) return '#f87171';
    if (fails >= 6) return '#fb923c';
    if (fails >= 4) return '#f97316';
    if (fails >= 3) return '#facc15';
    if (fails >= 2) return '#a3e635';
    if (fails >= 1) return '#3b82f6';
    return '#10b981';
  }, []);

  const paginatedData = useMemo(() => {
    if (!selectedTest || !data || !data[selectedStation]) return [];
    return data[selectedStation][selectedTest].slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [data, selectedStation, selectedTest, currentPage]);

  const totalPages = useMemo(() => {
    if (!selectedTest || !data || !data[selectedStation]) return 0;
    return Math.ceil(data[selectedStation][selectedTest].length / ITEMS_PER_PAGE);
  }, [data, selectedStation, selectedTest]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="mt-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            Failed Tests by Station
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="ml-2"
              aria-label="Refresh failed tests data"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role="alert"
              >
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <Select onValueChange={handleStationChange} value={selectedStation}>
                    <SelectTrigger aria-label="Select a station">
                      <SelectValue placeholder="Select a station" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(data).map((station) => (
                        <SelectItem key={station} value={station}>{station}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm flex items-center">
                  <strong className="mr-2">Total Failures:</strong> {totalFails || 'No data'}
                </div>
                <div className="text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <strong className="mr-2">Most Critical:</strong> {mostCriticalTest ? `${mostCriticalTest.name} (${mostCriticalTest.fails} fails)` : 'No data'}
                </div>
              </div>

              {sortedDataArray.length === 0 ? (
                <div className="flex items-center justify-center text-center mt-4 text-gray-500" style={{ height: '200px' }}>
                  No data available for this day.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={sortedDataArray}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, maxFails]} />
                    <YAxis dataKey="name" type="category" width={200} />
                    <Tooltip
                      formatter={(value, name, props) => [`${value} fails`, props.payload.name]}
                      labelFormatter={() => ''}
                    />
                    <Bar dataKey="fails" onClick={handleBarClick} cursor="pointer">
                      {sortedDataArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.fails)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {!selectedTest && sortedDataArray.length > 0 && (
                <div className="text-center mt-4 text-gray-500">
                  Click on any test fail to load more data about it.
                </div>
              )}

              <AnimatePresence>
                {selectedTest && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6"
                  >
                    <h3 className="text-lg font-semibold mb-2">{selectedTest} - Failed Devices</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device Code</TableHead>
                          <TableHead>Measured Value</TableHead>
                          <TableHead>Limit</TableHead>
                          <TableHead>Difference</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((device: TestRecord, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Link href={`/device?deviceCode=${encodeURIComponent(device.deviceCode)}`}>
                                {device.deviceCode}
                              </Link>
                            </TableCell>
                            <TableCell>{device.measuredValue}</TableCell>
                            <TableCell>{device.limit}</TableCell>
                            <TableCell>{device.difference}</TableCell>
                            <TableCell>{format(new Date(device.timestamp), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FailedTestsGraph;