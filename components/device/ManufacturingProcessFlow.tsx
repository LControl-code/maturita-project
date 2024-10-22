import React from 'react';
import StationCard from './StationCard';
import { Button } from "@/components/ui/button";

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useDevice } from '@/context/DeviceTrackingContext'


export default function ManufacturingProcessFlow() {
  const { refreshDevice, device } = useDevice()

  if (!device) return null

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          className="text-2xl font-semibold flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Manufacturing Process Flow
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={refreshDevice}
            aria-label="Refresh station data"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {device.stations.map((station, index) => (
          <StationCard
            key={station.name}
            station={station}
            isCurrentStation={station.name === device.currentStation}
            index={index}
          />
        ))}
      </div>
    </>
  );
};
