import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react'

import { getMonthTransactionTotal } from '@/api/get-month-transaction-total'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CardSkeleton } from './card-skeleton'

interface MonthTransactionTotal {
  from?: Date
  to?: Date
}

export function MonthTransactionTotal({ from, to }: MonthTransactionTotal) {
  const {
    data: monthTransactionTotal,
    isFetching: isLoadingMonthTransactionTotal,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-total', from, to],
    queryFn: () => getMonthTransactionTotal({ from, to }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Total</CardTitle>
        {isLoadingMonthTransactionTotal ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : Number(monthTransactionTotal?.amount) > 0 ? (
          <ArrowUp className="h-4 w-4 text-muted-foreground text-emerald-400" />
        ) : (
          <ArrowDown className="h-4 w-4 text-muted-foreground text-red-500" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {monthTransactionTotal ? (
          <>
            <span
              className={
                Number(monthTransactionTotal.amount) > 0
                  ? 'text-2xl font-bold text-emerald-500'
                  : 'text-2xl font-bold text-red-500'
              }
            >
              {(Number(monthTransactionTotal.amount) > 0 ? '' : '- ') +
                (Number(monthTransactionTotal.amount) / 100).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}
            </span>
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
