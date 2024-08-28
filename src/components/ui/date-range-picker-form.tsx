import { endOfMonth, format, startOfMonth } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import React from 'react'

interface DateRangePickerProps extends ComponentProps<'div'> {
  onSelectDate: (date: DateRange) => void
  today?: boolean;
}

export function DateRangePickerForm({
  onSelectDate,
  today,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange>();


  const handleDateChange = (selectedDate: DateRange) => {
    setDate(selectedDate);
    if (onSelectDate) {
      onSelectDate(selectedDate);
    }
  };

  React.useEffect(() => {
    if (today) {
      setDate({from: startOfMonth(new Date()), to: endOfMonth(new Date())});
    }
  }, [today]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start px-3 text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yyyy')} -{' '}
                  {format(date.to, 'dd/MM/yyyy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yyyy')
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}