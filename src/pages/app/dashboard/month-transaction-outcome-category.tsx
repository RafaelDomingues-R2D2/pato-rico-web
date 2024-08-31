import { useQuery } from '@tanstack/react-query'

import {Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { getMonthTransactionOutcomeCategory } from '@/api/get-month-transaction-outcome-category'

interface MonthTransactionOutcomeCategory {
  from?: Date
  to?: Date
}

export function MonthTransactionOutcomeCategory({from, to}: MonthTransactionOutcomeCategory) {
  const {
    data: monthTransactionOutcomeCategory,
    // isFetching: isLoadingMonthTransactionOutcomeCategory,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-outcome-category', from, to],
    queryFn: () => getMonthTransactionOutcomeCategory({from, to}),
  })

  const chartConfig = monthTransactionOutcomeCategory?.config || {}

  return (
    <Card className="flex flex-col col-span-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gasto por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mt-8">
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
            >
              {/* <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total de gasto
                        </tspan>
                      </text>
                    )
                  }
                }}
              /> */}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
