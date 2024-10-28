"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { format } from 'date-fns'
import Link from 'next/link'
import { AlertOctagon, Filter } from 'lucide-react'
import { pb } from '@/lib/pocketbase_connect'
import { ErrorData, LiveErrorRecord } from '@/types/errors'

interface LiveErrorsProps {
  initialData: ErrorData[];
}

const MAX_ERRORS = 50

const LiveErrors: React.FC<LiveErrorsProps> = ({ initialData }) => {
  const [errors, setErrors] = useState<ErrorData[]>(initialData)
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
    pb.collection('live_errors').subscribe('*', async (e) => {
      try {
        const record = e.record as LiveErrorRecord
        const newError: ErrorData = record.test_data
        if (newError.errors.length > 0) {
          setErrors(prevErrors => [newError, ...prevErrors].slice(0, MAX_ERRORS))
        }
      } catch (error) {
        console.error('Error processing new record:', error)
      }
    })

    return () => {
      pb.collection('live_errors').unsubscribe()
    }
  }, [])

  const formatStationName = useCallback((station: string) => {
    return station.toUpperCase()
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
                                <AlertOctagon className="w-5 h-5 text-destructive" />
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
                            <div className="flex flex-col h-full">
                              <SheetHeader>
                                <SheetTitle className="text-2xl font-bold">
                                  Error Details
                                </SheetTitle>
                                <SheetDescription>
                                  {format(new Date(error.timestamp), 'HH:mm:ss dd.MM.yyyy')} - {formatStationName(error.station)}
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-6 mb-4 pr-4">
                                <h4 className="text-lg font-semibold mb-2">Device Information</h4>
                                <div className="space-y-2">
                                  <Link
                                    href={`/device?deviceCode=${encodeURIComponent(error.deviceCode)}`}
                                    className="block px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                                  >
                                    Device Code: {error.deviceCode}
                                  </Link>
                                  <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md">
                                    Device ID: {error.deviceId}
                                  </div>
                                </div>
                              </div>
                              <ScrollArea className="flex-grow">
                                <div className="space-y-4">
                                  {error.errors.map((detail, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                      <h4 className="text-lg font-semibold mb-2">{detail.test}</h4>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <span className="font-medium">Measured:</span> {detail.value.toFixed(3)}
                                        </div>
                                        <div>
                                          <span className="font-medium">Limit:</span> {detail.limit.toFixed(3)}
                                        </div>
                                        <div>
                                          <span className="font-medium">Type:</span> {detail.type}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
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

export default LiveErrors