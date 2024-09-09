import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { getMonthTransactionOutcomeReservation } from '@/api/get-month-transaction-outcome-reservation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface MonthTransactionOutcomeResevation {
  from?: Date
  to?: Date
}

export function MonthTransactionOutcomeReservation({
  from,
  to,
}: MonthTransactionOutcomeResevation) {
  const {
    data: monthTransactionOutcomeResevation,
    // isFetching: isLoadingMonthTransactionOutcomeTypeOfExpense,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-outcome-reservation', from, to],
    queryFn: () => getMonthTransactionOutcomeReservation({ from, to }),
  })

  const chartConfig = {
    saida: {
      label: 'Saida',
      color: 'hsl(var(--chart-2))',
    },
    meta: {
      label: 'Meta',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Saída e metas por tipo de reserva</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px] w-[100%]">
          <BarChart accessibilityLayer data={monthTransactionOutcomeResevation}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="saida" fill="hsl(var(--chart-1))" radius={4} />
            <Bar dataKey="meta" fill="hsl(var(--chart-2))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
