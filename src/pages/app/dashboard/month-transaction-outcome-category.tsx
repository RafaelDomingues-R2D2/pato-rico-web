import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts'
import colors from 'tailwindcss/colors'

import { getMonthTransactionOutcomeCategory } from '@/api/get-month-transaction-outcome-category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function CustomTooltip({ active, payload }: TooltipProps<number, number>) {
  if (active && payload && payload.length && payload[0].value) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <span className="text-base font-semibold">
          {payload[0].payload.category}
        </span>
        <div className="flex flex-col gap-1">
          <span className="">
            <span className="font-semibold">Despesas:</span>{' '}
            {(payload[0].value / 100).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
      </div>
    )
  }

  return null
}

const COLORS = [
  colors.sky[500],
  colors.amber[500],
  colors.violet[500],
  colors.emerald[500],
]

export function MonthTransactionOutcomeCategory() {
  const {
    data: monthTransactionOutcomeCategory,
    isFetching: isLoadingMonthTransactionOutcomeCategory,
  } = useQuery({
    queryKey: ['metrics', 'month-transaction-outcome-category'],
    queryFn: getMonthTransactionOutcomeCategory,
  })

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-8">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            Despesas por Categoria (mês)
            {isLoadingMonthTransactionOutcomeCategory && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {monthTransactionOutcomeCategory ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart style={{ fontSize: 14 }}>
              <Pie
                data={monthTransactionOutcomeCategory}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={96}
                innerRadius={64}
                strokeWidth={8}
                fill={colors.emerald['500']}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180
                  const radius = 12 + innerRadius + (outerRadius - innerRadius)
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)

                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-muted-foreground text-xs"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                    >
                      {monthTransactionOutcomeCategory[index].category
                        .substring(0, 12)
                        .concat('...')}{' '}
                      (
                      {(value / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                      )
                    </text>
                  )
                }}
                labelLine={false}
              >
                {monthTransactionOutcomeCategory.map((_, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="stroke-background hover:opacity-80"
                    />
                  )
                })}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
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
