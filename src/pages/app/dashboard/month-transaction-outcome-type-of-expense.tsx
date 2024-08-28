import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { getMonthTransactionOutcomeTypeOfExpense } from '@/api/get-month-transaction-outcome-type-of-expense'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MonthTransactionOutcomeTypeOfExpense {
  from?: Date
  to?: Date
}

export function MonthTransactionOutcomeTypeOfExpense({from, to}: MonthTransactionOutcomeTypeOfExpense) {
  const {
    data: monthTransactionOutcomeTypeOfExpense,
    isFetching: isLoadingMonthTransactionOutcomeTypeOfExpense,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-outcome-type-of-expense', from, to],
    queryFn: () => getMonthTransactionOutcomeTypeOfExpense({from, to}),
  })

  return (
    <Card className="col-span-6">
      <CardHeader className="pb-8">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            Despesas por Tipo de Gasto (mês)
            {isLoadingMonthTransactionOutcomeTypeOfExpense && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {monthTransactionOutcomeTypeOfExpense ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              width={500}
              height={300}
              data={monthTransactionOutcomeTypeOfExpense}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="valor"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="meta"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[240px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
