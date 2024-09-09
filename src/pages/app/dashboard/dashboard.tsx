import { endOfMonth, startOfMonth } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Helmet } from 'react-helmet-async'

import { DateRangePicker } from '@/components/ui/date-range-picker'

import { MonthTransactionIncome } from './month-transaction-income'
import { MonthTransactionOutcome } from './month-transaction-outcome'
import { MonthTransactionOutcomeCategory } from './month-transaction-outcome-category'
import { MonthTransactionOutcomeReservation } from './month-transaction-outcome-reservation'
import { MonthTransactionTotal } from './month-transaction-total'

export function Dashboard() {
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <DateRangePicker date={period} onDateChange={setPeriod} />

        <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
          <MonthTransactionIncome from={period?.from} to={period?.to} />
          <MonthTransactionOutcome from={period?.from} to={period?.to} />
          <MonthTransactionTotal from={period?.from} to={period?.to} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
          <MonthTransactionOutcomeCategory
            from={period?.from}
            to={period?.to}
          />
          <MonthTransactionOutcomeReservation
            from={period?.from}
            to={period?.to}
          />
        </div>
      </div>
    </>
  )
}
