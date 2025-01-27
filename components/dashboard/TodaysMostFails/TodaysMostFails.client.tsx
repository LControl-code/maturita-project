// components/dashboard/TodaysMostFails/TodaysMostFails.client.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    Tooltip
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import type { FailsData, StationData, TopTestStation } from "./types";

/**
 * Splits stationLineKey like "A25-2" => { stationName: "A25", lineNumber: "2" }
 */
function parseStationLineKey(stationLineKey: string) {
    const [stationName, lineNumber] = stationLineKey.split("-");
    return { stationName, lineNumber };
}

/**
 * Aggregates topTests across multiple StationData objects, summing counts by test.name,
 * then sorting descending. Returns an array of { name, count }.
 */
function getCombinedTopTests(stationDatas: StationData[]): TopTestStation[] {
    const testCountMap: Record<string, number> = {};

    stationDatas.forEach((st) => {
        st.topTests.forEach((test) => {
            if (!testCountMap[test.name]) {
                testCountMap[test.name] = 0;
            }
            testCountMap[test.name] += test.count;
        });
    });

    // Convert map => array => sort desc
    const combined = Object.entries(testCountMap)
        .map(([testName, count]) => ({ name: testName, count }))
        .sort((a, b) => b.count - a.count);

    return combined;
}

interface TodaysMostFailsProps {
    initialData: FailsData;
}

export default function TodaysMostFailsClient({ initialData }: TodaysMostFailsProps) {
    const [failsData, setFailsData] = useState<FailsData>(initialData);

    // 1) Station filter
    const [selectedStation, setSelectedStation] = useState<string>("All Stations");

    // 2) Line filter
    const [selectedLine, setSelectedLine] = useState<string>("All Lines");

    // Update local state if/when server revalidates
    useEffect(() => {
        setFailsData(initialData);
    }, [initialData]);

    // Grab the array of station objects
    const stations = failsData["Top Fails"].Stations;

    // ----- Build unique station names & line numbers -----
    const allStationNames = useMemo(() => {
        const setOfStations = new Set<string>();
        stations.forEach((st) => {
            const { stationName } = parseStationLineKey(st.stationLineKey);
            setOfStations.add(stationName);
        });
        return Array.from(setOfStations);
    }, [stations]);

    const allLineNumbers = useMemo(() => {
        const setOfLines = new Set<string>();
        stations.forEach((st) => {
            const { lineNumber } = parseStationLineKey(st.stationLineKey);
            setOfLines.add(lineNumber);
        });
        return Array.from(setOfLines);
    }, [stations]);

    // ----- Filter logic -----
    // We find all stations that match the user’s station + line selection
    const filteredStations = useMemo(() => {
        return stations.filter((st) => {
            const { stationName, lineNumber } = parseStationLineKey(st.stationLineKey);

            const stationMatch =
                selectedStation === "All Stations" || stationName === selectedStation;

            const lineMatch =
                selectedLine === "All Lines" || lineNumber === selectedLine;

            return stationMatch && lineMatch;
        });
    }, [stations, selectedStation, selectedLine]);

    // Combine the topTests from the filtered stations, then take the top 3
    const combinedTopTests = useMemo(() => {
        const combined = getCombinedTopTests(filteredStations);
        return combined.slice(0, 5); // top 3
    }, [filteredStations]);

    // Prepare data for the RadarChart
    // Each item needs something like { subject: 'TestName', value: 123 }
    const radarData = useMemo(() => {
        return combinedTopTests.map((test) => ({
            subject: test.name,
            value: test.count,
        }));
    }, [combinedTopTests]);

    // Sum of the top 3 for display
    const totalFails = radarData.reduce((sum, item) => sum + item.value, 0);

    // Recharts color, you can add more if needed
    const RADAR_COLOR = "#8884d8";

    // Custom tooltip for the Radar
    const CustomTooltip: React.FC<any> = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        const { subject, value } = payload[0].payload;
        return (
            <div className="p-2 bg-white border rounded shadow">
                <p className="font-semibold">{subject}</p>
                <p>Fails: {value}</p>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col h-full"
        >
            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center w-full">
                        <span>Today&apos;s Most Fails</span>
                        <Badge variant="secondary">{totalFails} Total</Badge>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col gap-4">
                    {/* -- FILTER: Station & Line -- */}
                    <div className="flex flex-row gap-4">
                        {/* Station Select */}
                        <Select
                            value={selectedStation}
                            onValueChange={(val) => setSelectedStation(val)}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select station" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Stations">All Stations</SelectItem>
                                {allStationNames.map((stationName) => (
                                    <SelectItem key={stationName} value={stationName}>
                                        {stationName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Line Select */}
                        <Select
                            value={selectedLine}
                            onValueChange={(val) => setSelectedLine(val)}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select line" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Lines">All Lines</SelectItem>
                                {allLineNumbers.map((ln) => (
                                    <SelectItem key={ln} value={ln}>
                                        {ln}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* -- CHART AREA -- */}
                    <div className="flex-grow relative">
                        <AnimatePresence>
                            {radarData.length === 0 ? (
                                <motion.div
                                    key="no-data"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <p className="text-gray-500">No data available.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="radar-chart"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full"
                                >
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RadarChart
                                            data={radarData}
                                            outerRadius="70%"
                                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                        >
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            {/*
                        If you know the maximum count possible,
                        you can set domain={...} or a custom tick count
                        e.g. <PolarRadiusAxis domain={[0, 'dataMax']} />
                      */}
                                            <PolarRadiusAxis />

                                            <Radar
                                                name="Fails"         // Legend label
                                                dataKey="value"
                                                stroke={RADAR_COLOR}
                                                fill={RADAR_COLOR}
                                                fillOpacity={0.6}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
