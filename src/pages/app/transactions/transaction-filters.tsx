import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useEffect } from 'react'
import { DateRangePickerForm } from '@/components/ui/date-range-picker-form'
import { DateRange } from 'react-day-picker'

const transactionFilterSchema = z.object({
  initialDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
})

type TransactionFilterSchema = z.infer<typeof transactionFilterSchema>

export function TransactionFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialDate = searchParams.get('initialDate') ?? format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const endDate = searchParams.get('endDate') ?? format(endOfMonth(new Date()), 'yyyy-MM-dd')

  const { handleSubmit, reset, setValue } = useForm<TransactionFilterSchema>({
    defaultValues: {
      initialDate: initialDate,
      endDate: endDate,
    },
  })

  function handlerFilter(data: TransactionFilterSchema) {
    const initialDate = data.initialDate
    const endDate = data.endDate

    setSearchParams((prev) => {
      if (initialDate) {
        prev.set('initialDate', String(initialDate))
      } else {
        prev.delete('initialDate')
      }

      if (endDate) {
        prev.set('endDate', String(endDate))
      } else {
        prev.delete('endDate')
      }

      prev.set('page', '1')

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.set('page', '1')
      prev.set('initialDate', format(startOfMonth(new Date()), 'yyyy-MM-dd'))
      prev.set('endDate', format(endOfMonth(new Date()), 'yyyy-MM-dd'))
      

      return prev
    })

    reset({
      initialDate: null,
      endDate: null,
    })
  }

  const handleDateRange = (selectedDate: DateRange) => {
    if (selectedDate) {
      setValue('initialDate', format(selectedDate.from ?? '', 'yyyy-MM-dd'));
      setValue('endDate',  format(selectedDate.to ?? '', 'yyyy-MM-dd'));
    }
  };

  useEffect(()=>{
    setSearchParams((prev) => {
      prev.set('page', '1')
      prev.set('initialDate', format(startOfMonth(new Date()), 'yyyy-MM-dd'))
      prev.set('endDate', format(endOfMonth(new Date()), 'yyyy-MM-dd'))

      return prev
    })
  },[])

  return (
    <form onSubmit={handleSubmit(handlerFilter)}>
      <span>Filtros:</span>
      <DateRangePickerForm onSelectDate={handleDateRange} today={true}/>
      
      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={handleClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
