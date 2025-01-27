"use client"
import React, { useState, useEffect } from "react";
import { pb } from "@/lib/pocketbase_connect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// The shape of data we expect
interface StatsData {
  id: string;              // so we can subscribe to this record
  totalTested: number;
  activeStations?: number;
  todaysProduction?: number;    // e.g., 45.8 => 45.8%
  overallEfficiency?: number;   // e.g., 90 => 90% for the progress bar
}


const DashboardOverview: React.FC<{ initialData: StatsData }> = ({ initialData }) => {
  // Initialize local state with the server-provided data
  const [stats, setStats] = useState<StatsData>(initialData);


  // useEffect(() => {
  //   if (!stats.id) {
  //     // If there's no valid record id, we can't subscribe. Possibly no data found.
  //     return;
  //   }
  //
  //   // Subscribe to real-time changes on this record
  //   pb.collection("stats").subscribe(stats.id, (e) => {
  //     // e.record => the updated record
  //     if (e.action === "update") {
  //       const updated = e.record;
  //
  //       // Update only the fields we care about in local state
  //       setStats((prev) => ({
  //         ...prev,
  //         totalTested: updated.totalTested ?? prev.totalTested,
  //         activeStations: updated.activeStations ?? prev.activeStations,
  //         todaysProduction: updated.todaysProduction ?? prev.todaysProduction,
  //         overallEfficiency: updated.overallEfficiency ?? prev.overallEfficiency,
  //       }));
  //     }
  //   });
  //
  //   // Cleanup to avoid memory leaks if the component unmounts
  //   return () => {
  //     pb.collection("stats").unsubscribe(stats.id);
  //   };
  // }, [stats.id]);

  // If stats are not loaded (rare, since we had initialData), we can show a fallback
  // but realistically we always have something from server side
  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
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
              {/* TOTAL DEVICES */}
              <div>
                <p className="font-semibold">Total Devices:</p>
                <p className="text-2xl font-bold">{stats.totalTested ?? 0}</p>
              </div>

              {/* ACTIVE STATIONS */}
              <div>
                <p className="font-semibold">Active Stations:</p>
                <p className="text-2xl font-bold">{stats.activeStations ?? 0}</p>
              </div>

              {/* TODAY'S PRODUCTION */}
              <div>
                <p className="font-semibold">Today&apos;s Production:</p>
                {/* e.g. 45.8 => "45.8 %" */}
                <p className="text-2xl font-bold">
                  {stats.todaysProduction?.toFixed(1) ?? 0} %
                </p>
              </div>

              {/* OVERALL EFFICIENCY (progress bar) */}
              <div>
                <p className="font-semibold">Overall Efficiency:</p>

                <TooltipProvider>
                  <Tooltip>
                    {/*
      `asChild` lets the Trigger adopt the child's display styling
      rather than forcing inline.
    */}
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Progress value={stats.overallEfficiency ?? 0} className="mt-2" />
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>{stats.overallEfficiency?.toFixed(1) ?? 0}% Efficiency</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
  );
};

export default DashboardOverview;
