"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const DashboardOverview: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
    className="flex-grow"
  >
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="mr-2" />
          Dashboard Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Total Devices:</p>
            <p className="text-2xl font-bold">2 504</p>
          </div>
          <div>
            <p className="font-semibold">Active Stations:</p>
            <p className="text-2xl font-bold">14</p>
          </div>
          <div>
            <p className="font-semibold">Today&apos;s Production:</p>
            <p className="text-2xl font-bold">45.8 %</p>
          </div>
          <div>
            <p className="font-semibold">Overall Efficiency:</p>
            <Progress value={90} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default DashboardOverview;