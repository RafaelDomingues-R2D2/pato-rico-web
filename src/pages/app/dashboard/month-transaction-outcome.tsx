import { useQuery } from '@tanstack/react-query'
import { DollarSign, Loader2 } from 'lucide-react'

import { getMonthTransactionOutcome } from '@/api/get-month-transaction-outcome'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CardSkeleton } from './card-skeleton'

interface MonthTransactionOutcome {
  from?: Date
  to?: Date
}

export function MonthTransactionOutcome({ from, to }: MonthTransactionOutcome) {
  const {
    data: monthTransactionOutcome,
    isFetching: isLoadingMonthTransactionOutcome,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-outcome', from, to],
    queryFn: () => getMonthTransactionOutcome({ from, to }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Saída</CardTitle>
        {isLoadingMonthTransactionOutcome ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {monthTransactionOutcome ? (
          <>
            <span className="text-2xl font-bold text-red-500">
              {'- ' +
                (Number(monthTransactionOutcome.amount) / 100).toLocaleString(
                  'pt-BR',
                  {
                    style: 'currency',
                    currency: 'BRL',
                  },
                )}
            </span>
            {/* <p className="text-xs text-muted-foreground">
              <span
                className={
                  monthOutcomeTransactioneCategory.lastAmount > 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {monthOutcomeTransactioneCategory.lastAmount > 0
                  ? `+${monthOutcomeTransactioneCategory.lastAmount}`
                  : monthOutcomeTransactioneCategory.lastAmount}
              </span>{' '}
              em relação ao mês passado
            </p> */}
          </>
        ) : (
          <CardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
