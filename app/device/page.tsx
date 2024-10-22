"use client"

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from 'framer-motion'
import DeviceInfo from '@/components/device/DeviceInfo'
import StatusOverview from '@/components/device/StatusOverview'
import ManufacturingProcessFlow from '@/components/device/ManufacturingProcessFlow'
import { Loader2, Search, Clock, X } from 'lucide-react'
import { getCookie, setCookie } from 'cookies-next'
import { DeviceProvider, useDevice } from '@/context/DeviceTrackingContext'

const COOKIE_NAME = 'device_search_history'
const MAX_HISTORY_ITEMS = 5

function DeviceTrackingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deviceCodeParam = searchParams.get('deviceCode')
  const { device, loading, fetchDevice } = useDevice()
  const [inputDeviceCode, setInputDeviceCode] = useState<string>(deviceCodeParam ? decodeURIComponent(deviceCodeParam) : '')
  const prevDeviceCodeRef = useRef<string>(inputDeviceCode)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Load search history from cookies on mount
  useEffect(() => {
    const historyCookie = getCookie(COOKIE_NAME)
    if (historyCookie) {
      try {
        const history = JSON.parse(historyCookie as string)
        setSearchHistory(history)
      } catch {
        console.error('Failed to parse search history cookie')
      }
    }
  }, [])

  // Update search history
  const updateSearchHistory = useCallback((deviceCode: string) => {
    setSearchHistory(prev => {
      const newHistory = [deviceCode, ...prev.filter(code => code !== deviceCode)]
        .slice(0, MAX_HISTORY_ITEMS)
      setCookie(COOKIE_NAME, JSON.stringify(newHistory), { sameSite: 'lax' })
      return newHistory
    })
  }, [])

  useEffect(() => {
    if (deviceCodeParam) {
      fetchDevice(deviceCodeParam)
      updateSearchHistory(deviceCodeParam)
    }
  }, [deviceCodeParam, fetchDevice, updateSearchHistory])

  const handleTrack = () => {
    if (inputDeviceCode === deviceCodeParam && inputDeviceCode === prevDeviceCodeRef.current) {
      return
    }
    prevDeviceCodeRef.current = inputDeviceCode

    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('deviceCode', inputDeviceCode)
    router.push(`/device?${newSearchParams.toString()}`)
    fetchDevice(inputDeviceCode)
    updateSearchHistory(inputDeviceCode)
  }

  const handleHistorySelect = (deviceCode: string) => {
    setInputDeviceCode(deviceCode)
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('deviceCode', deviceCode)
    router.push(`/device?${newSearchParams.toString()}`)
    fetchDevice(deviceCode)
    updateSearchHistory(deviceCode)
  }

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchHistory([])
    setCookie(COOKIE_NAME, '[]', { sameSite: 'lax' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-6"
    >

      <motion.h1
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Device Tracking
      </motion.h1>
      <Card>
        <CardHeader>
          <CardTitle>Track a Device</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-grow">
              <Input
                placeholder="Enter device code"
                value={inputDeviceCode}
                onChange={(e) => setInputDeviceCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTrack()
                  }
                }}
                className="pr-10"
                aria-label="Device code input"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Button onClick={handleTrack} disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                'Track'
              )}
            </Button>
          </div>

          {searchHistory.length > 0 && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Recent searches:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[150px] max-w-full">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    Recent Devices
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      className="h-6 px-2 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {searchHistory
                    .filter((code) => code !== inputDeviceCode)
                    .map((code, index) => (
                      <DropdownMenuItem
                        key={code}
                        onClick={() => handleHistorySelect(code)}
                        className="cursor-pointer"
                      >
                        {index + 1}. {code}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {device && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <DeviceInfo />
              <StatusOverview />
            </div>
            <ManufacturingProcessFlow />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DeviceTrackingPage() {
  return (
    <DeviceProvider>
      <Suspense>
        <DeviceTrackingContent />
      </Suspense>
    </DeviceProvider>
  )
}
