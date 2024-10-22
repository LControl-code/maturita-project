import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Station, Test } from '@/types/device'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface StationCardProps {
  station: Station
  isCurrentStation: boolean
  index: number
}

const StationCard: React.FC<StationCardProps> = ({ station, isCurrentStation, index }) => {
  const [isOpen, setIsOpen] = useState(false)

  const statusColor =
    station.status === 'passed' ? 'text-green-500' :
      station.status === 'failed' ? 'text-red-500' :
        station.status === 'in-progress' ? 'text-yellow-500' :
          'text-gray-500'

  const statusIcon =
    station.status === 'passed' ? <CheckCircle className={`w-5 h-5 ${statusColor}`} /> :
      station.status === 'failed' ? <XCircle className={`w-5 h-5 ${statusColor}`} /> :
        station.status === 'in-progress' ? <AlertCircle className={`w-5 h-5 ${statusColor}`} /> :
          null

  const failedTests = station.tests.filter(test => test.result === 'failed')
  const passedTests = station.tests.filter(test => test.result === 'passed')

  const getInitialTab = () => {
    if (failedTests.length > 0) return "failed"
    if (passedTests.length > 0) return "passed"
    return "failed"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card
            className={`cursor-pointer transition-all select-none ${isCurrentStation ? 'border-blue-500 shadow-lg' : 'hover:border-gray-400'
              } ${station.status === 'pending' ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {station.name}
                {statusIcon}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  station.status === 'passed' ? 'success' :
                    station.status === 'failed' ? 'destructive' :
                      station.status === 'in-progress' ? 'warning' :
                        'secondary'
                }
              >
                {station.status === 'failed' && failedTests.length > 0 ? `${failedTests.length} failed` : station.status}
              </Badge>
            </CardContent>
          </Card>
        </DialogTrigger>
        {station.status !== 'pending' && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{station.name}</DialogTitle>
              <DialogDescription>Test results for this station</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue={getInitialTab()} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="failed" className="flex items-center justify-center gap-2">
                  Failed
                  <Badge variant="destructive" className="h-6 w-6 flex items-center justify-center rounded-full">
                    {failedTests.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="passed" className="flex items-center justify-center gap-2">
                  Passed
                  <Badge variant="success" className="h-6 w-6 flex items-center justify-center rounded-full">
                    {passedTests.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="failed" className="h-[400px]">
                <ScrollArea className="h-full pr-4">
                  {failedTests.length > 0 ? (
                    failedTests.map((test, index) => (
                      <TestResult key={index} test={test} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No failed tests
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="passed" className="h-[400px]">
                <ScrollArea className="h-full pr-4">
                  {passedTests.length > 0 ? (
                    passedTests.map((test, index) => (
                      <TestResult key={index} test={test} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No passed tests
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  )
}

const TestResult: React.FC<{ test: Test }> = ({ test }) => (
  <div className="py-3 border-b last:border-b-0">
    <div className="flex justify-between items-start">
      <div>
        <span className="font-medium">{test.name}</span>
        {test.measuredValue && (
          <div className="text-sm text-gray-500 mt-1">
            Measured: {test.measuredValue}
            {test.result === 'failed' && test.offsetFromLimit && (
              <span className="text-red-500 text-xs ml-1">({test.offsetFromLimit})</span>
            )}
          </div>
        )}
      </div>
      <Badge
        variant={
          test.result === 'passed' ? 'success' :
            test.result === 'failed' ? 'destructive' :
              'secondary'
        }
        className="ml-2"
      >
        {test.result}
      </Badge>
    </div>
  </div>
)

export default StationCard