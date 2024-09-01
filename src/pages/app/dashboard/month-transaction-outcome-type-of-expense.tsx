import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { getMonthTransactionOutcomeTypeOfExpense } from "@/api/get-month-transaction-outcome-type-of-expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MonthTransactionOutcomeTypeOfExpense {
  from?: Date;
  to?: Date;
}

export function MonthTransactionOutcomeTypeOfExpense({
  from,
  to,
}: MonthTransactionOutcomeTypeOfExpense) {
  const {
    data: monthTransactionOutcomeTypeOfExpense,
    // isFetching: isLoadingMonthTransactionOutcomeTypeOfExpense,
  } = useQuery({
    queryKey: [
      "metrics",
      "month-transaction-outcome-type-of-expense",
      from,
      to,
    ],
    queryFn: () => getMonthTransactionOutcomeTypeOfExpense({ from, to }),
  });

  const chartConfig = {
    gasto: {
      label: "Gasto",
      color: "hsl(var(--chart-2))",
    },
    meta: {
      label: "Meta",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Saida e metas por tipo de gasto</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px] w-[100%]">
          <BarChart
            accessibilityLayer
            data={monthTransactionOutcomeTypeOfExpense}
          >
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
            <Bar dataKey="valor" fill="hsl(var(--chart-1))" radius={4} />
            <Bar dataKey="meta" fill="hsl(var(--chart-2))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
