import { useQuery } from '@tanstack/react-query'
import { DollarSign, Loader2 } from 'lucide-react'

import { getMonthTransactionIncome } from '@/api/get-month-transaction-income'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CardSkeleton } from './card-skeleton'

interface MonthTransactionIncome {
  from?: Date
  to?: Date
}

export function MonthTransactionIncome({from, to}: MonthTransactionIncome) {
  const {
    data: monthTransactionIncome,
    isFetching: isLoadingMonthTransactionIncome,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-income', from, to],
    queryFn: () => getMonthTransactionIncome({from, to}),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Receita (mês)</CardTitle>
        {isLoadingMonthTransactionIncome ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <DollarSign className="h-4 w-4  text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        {monthTransactionIncome ? (
          <>
            <span className="text-2xl font-bold text-emerald-500">
              {(Number(monthTransactionIncome.amount) / 100).toLocaleString(
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
