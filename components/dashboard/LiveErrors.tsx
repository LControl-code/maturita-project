"use client"

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCollectionSubscribe } from '@/hooks/useCollectionSubscribe'
import { getLimitsForMotorType } from '@/lib/pocketbase_connect'
import { motion, AnimatePresence } from "framer-motion"
import { format } from 'date-fns'
import Link from 'next/link'
import { AlertTriangle, AlertCircle, AlertOctagon, Filter } from 'lucide-react'

interface ErrorDetail {
  test: string
  value: number
  limit: number
  severity: 'low' | 'medium' | 'high'
  type: 'above' | 'below'
}

interface ErrorData {
  id: string
  station: string
  errors: ErrorDetail[]
  deviceCode: string
  timestamp: string
}

interface RecordData {
  id: string
  device_code: string
  motor_type: string
  test_fail: boolean
  time: string
  [key: string]: string | number | boolean
}

interface CollectionRecord {
  collection: string
  record: RecordData
}

interface TestLimits {
  [key: string]: {
    [stationType: string]: Array<{
      [key: string]: number
    }>
  }
}

const MAX_ERRORS = 50
const LOCAL_STORAGE_KEY = 'liveErrors'

const LiveErrors: React.FC = () => {
  const { lastUpdate, record } = useCollectionSubscribe() as {
    lastUpdate: number | null,
    record: CollectionRecord | null
  }
  const [errors, setErrors] = useState<ErrorData[]>([])
  const [selectedStation, setSelectedStation] = useState<string>("all")

  const stations = useMemo(() =>
    Array.from(new Set(errors.map(error => error.station))),
    [errors]
  )

  const filteredErrors = useMemo(() =>
    selectedStation === "all"
      ? errors
      : errors.filter(error => error.station === selectedStation),
    [selectedStation, errors]
  )

  useEffect(() => {
    const storedErrors = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedErrors) {
      setErrors(JSON.parse(storedErrors))
    }
  }, [])

  useEffect(() => {
    if (errors.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(errors))
    }
  }, [errors])

  const compareWithLimits = useCallback((data: RecordData, limits: TestLimits): ErrorData => {
    console.log('Limits:', limits);
    console.log('Record Data:', data);
    const errorDetails: ErrorDetail[] = []
    const excludeColumns = [
      'collectionId', 'collectionName', 'created', 'device_code',
      'id', 'motor_type', 'test_fail', 'time', 'updated'
    ];

    Object.entries(data).forEach(([key, value]) => {
      if (!excludeColumns.includes(key)) {
        const numericValue = Number(value);

        if (!isNaN(numericValue)) {
          Object.entries(limits).forEach(([limitKey, limitValue]) => {
            if (limitKey.startsWith(key) && typeof limitValue === 'number') {
              if (limitKey.endsWith('_MAX') && numericValue > limitValue) {
                errorDetails.push({
                  test: key,
                  value: numericValue,
                  limit: limitValue,
                  severity: 'high',
                  type: 'above'
                });
              } else if (limitKey.endsWith('_MIN') && numericValue < limitValue) {
                errorDetails.push({
                  test: key,
                  value: numericValue,
                  limit: limitValue,
                  severity: 'low',
                  type: 'below'
                });
              }
            }
          });
        }
      }
    });

    return {
      id: `${data.id}-${Date.now()}`,
      station: record?.collection || '',
      errors: errorDetails,
      deviceCode: data.device_code,
      timestamp: data.time,
    }
  }, [record])

  useEffect(() => {
    if (lastUpdate && record?.record && record.record.test_fail) {
      const checkLimits = async () => {
        const motorType = record.record.motor_type as 'EFAD' | 'ERAD' | 'Short' | undefined
        const limits = await getLimitsForMotorType(motorType)

        if (record?.collection) {
          const collectionLimits = limits[record.collection];
          if (collectionLimits) {
            const newErrors = compareWithLimits(record.record, collectionLimits[0] as unknown as TestLimits);
            setErrors(prevErrors => {
              const updatedErrors = [newErrors, ...prevErrors].slice(0, MAX_ERRORS);
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedErrors));
              return updatedErrors;
            });
          }
        }
      }

      checkLimits()
    }
  }, [lastUpdate, record, compareWithLimits])

  const formatStationName = useCallback((station: string) => {
    const parts = station.split('_')
    return parts.length > 1 ? parts.slice(1).join('_').toUpperCase() : station.toUpperCase()
  }, [])

  const getSeverityIcon = useCallback((severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <AlertOctagon className="w-5 h-5 text-destructive" />
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case 'low':
        return <AlertCircle className="w-5 h-5 text-secondary" />
    }
  }, [])

  const getSeverityColor = useCallback((severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'text-destructive'
      case 'medium':
        return 'text-warning'
      case 'low':
        return 'text-secondary'
    }
  }, [])

  const errorVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-col"
    >
      <Card className="flex-grow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Live Errors</CardTitle>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {formatStationName(station)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] lg:h-[300px] pr-4">
            <AnimatePresence initial={false}>
              {filteredErrors.length > 0 ? (
                <motion.ul className="space-y-2">
                  <AnimatePresence initial={false}>
                    {filteredErrors.map((error) => (
                      <motion.li
                        key={error.id}
                        variants={errorVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 1
                        }}
                        layout
                      >
                        <Sheet>
                          <SheetTrigger asChild>
                            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-3 rounded-lg border border-gray-200 transition-colors duration-200">
                              <div className="flex items-center space-x-3">
                                {getSeverityIcon(error.errors.reduce((max, e) => e.severity === 'high' ? 'high' : (e.severity === 'medium' && max !== 'high' ? 'medium' : max), 'low' as 'low' | 'medium' | 'high'))}
                                <div>
                                  <span className="font-semibold">{format(new Date(error.timestamp), 'HH:mm:ss')}</span>
                                  <span className="mx-2">-</span>
                                  <span className="font-medium">{formatStationName(error.station)}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-sm">
                                {error.errors.length} {error.errors.length === 1 ? 'error' : 'errors'}
                              </Badge>
                            </div>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle className="text-2xl font-bold">
                                Error Details
                              </SheetTitle>
                              <SheetDescription>
                                {format(new Date(error.timestamp), 'HH:mm:ss dd.MM.yyyy')} - {formatStationName(error.station)}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                              {error.errors.map((detail, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="text-lg font-semibold mb-2">{detail.test}</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="font-medium">Value Measured:</span> {detail.value}
                                    </div>
                                    <div>
                                      <span className="font-medium">Limit:</span> {detail.limit}
                                    </div>
                                    <div>
                                      <span className="font-medium">Severity:</span> <span className={getSeverityColor(detail.severity)}>{detail.severity}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Type:</span> {detail.type}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Device Code</h4>
                                <Link href={`/device?deviceCode=${encodeURIComponent(error.deviceCode)}`} className="text-blue-600 hover:underline">
                                  {error.deviceCode}
                                </Link>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-full"
                >
                  <div className="text-gray-500 text-lg">No errors present</div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LiveErrors;