import { useQuery } from '@tanstack/react-query'
import { Loader2, PackageOpen } from 'lucide-react'
import { Pie, PieChart } from 'recharts'

import { getMonthTransactionOutcomeCategory } from '@/api/get-month-transaction-outcome-category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface MonthTransactionOutcomeCategory {
  from?: Date
  to?: Date
}

export function MonthTransactionOutcomeCategory({
  from,
  to,
}: MonthTransactionOutcomeCategory) {
  const {
    data: monthTransactionOutcomeCategory,
    isFetching: isLoadingMonthTransactionOutcomeCategory,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-outcome-category', from, to],
    queryFn: () => getMonthTransactionOutcomeCategory({ from, to }),
  })

  const chartConfig = monthTransactionOutcomeCategory?.config || {}

  return (
    <Card className="col-span-6 lg:col-span-3 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Saída por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="mt-8 flex-1 pb-0">
        {isLoadingMonthTransactionOutcomeCategory ? (
          <div className="p-20 lg:p-36 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground justify-center items-center" />
          </div>
        ) : monthTransactionOutcomeCategory?.result.length ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={monthTransactionOutcomeCategory?.result}
                dataKey="amount"
                nameKey="category"
                innerRadius={40}
                strokeWidth={5}
              ></Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="p-20 lg:p-36 flex justify-center">
            <PackageOpen size={60} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
