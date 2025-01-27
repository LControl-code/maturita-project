import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useDevice } from '@/context/DeviceTrackingContext'

/**
 * A component that displays an overview of test status statistics for a device.
 * 
 * This component shows:
 * - Overall pass rate percentage
 * - Number of passed/failed/total tests
 * - Estimated completion time
 * 
 * The component uses the device context through useDevice hook and calculates
 * statistics based on test results across all stations.
 * 
 * @returns {JSX.Element | null} Returns the status overview card or null if no device data is available
 * 
 * @example
 * ```tsx
 * <StatusOverview />
 * ```
 */
export default function StatusOverview() {
  const { device } = useDevice()

  if (!device) return null

  const passedTests = device.stations.reduce((acc, station) =>
    acc + station.tests.filter(test => test.result === 'passed').length, 0);
  const failedTests = device.stations.reduce((acc, station) =>
    acc + station.tests.filter(test => test.result === 'failed').length, 0);
  const totalTests = device.stations.reduce((acc, station) => acc + station.tests.length, 0);
  const passRate = (passedTests / (failedTests + passedTests)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2" />
            Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Pass Rate:</p>
              <p className="text-2xl font-bold text-green-500">{passRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-semibold">Tests Passed:</p>
              <p className="text-2xl font-bold">
                <span className="text-green-500">{passedTests}</span> / {totalTests} (
                <span className="text-red-500">{failedTests}</span> fails)
              </p>
            </div>
            <div>
              <p className="font-semibold">Estimated Completion:</p>
              <p className="text-2xl font-bold">2h 30m</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
