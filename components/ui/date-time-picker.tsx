"use client"

import * as React from "react"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DateTimePicker({
                                   date,
                                   setDate
                               }: {
    date: Date
    setDate: (date: Date) => void
}) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setSelectedDate(selectedDate)
            const newDateTime = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                date.getHours(),
                date.getMinutes()
            )
            setDate(newDateTime)
        }
    }

    const handleTimeChange = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number)
        if (selectedDate) {
            const newDateTime = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                hours,
                minutes
            )
            setDate(newDateTime)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP p") : <span>Pick date and time</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                <div className="p-3 border-t border-border">
                    <Select
                        onValueChange={handleTimeChange}
                        defaultValue={format(date, "HH:mm")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {Array.from({ length: 24 * 4 }).map((_, index) => {
                                const hours = Math.floor(index / 4)
                                const minutes = (index % 4) * 15
                                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                                return (
                                    <SelectItem key={index} value={timeString}>
                                        {timeString}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    )
}
