import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const transactionFilterSchema = z.object({
  initialDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
})

type TransactionFilterSchema = z.infer<typeof transactionFilterSchema>

export function TransactionFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialDate = searchParams.get('initialDate')
  const endDate = searchParams.get('endDate')

  const { register, handleSubmit, reset } = useForm<TransactionFilterSchema>({
    defaultValues: {
      initialDate: new Date(initialDate ?? '') ?? null,
      endDate: new Date(endDate ?? '') ?? null,
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

  // function monthLength() {
  //   return new Date(
  //     new Date().getFullYear(),
  //     new Date().getMonth() + 1,
  //     0,
  //   ).getDate()
  // }

  // new Date(new Date().getFullYear(), new Date().getMonth(), monthLength())

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete('initialDate')
      prev.delete('endDate')
      prev.set('page', '1')

      return prev
    })

    reset({
      initialDate: null,
      endDate: null,
    })
  }

  return (
    <form onSubmit={handleSubmit(handlerFilter)}>
      <span>Filtros:</span>
      <Input id="initial-date" type="date" {...register('initialDate')} />
      <Input id="end-date" type="date" {...register('endDate')} />
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
