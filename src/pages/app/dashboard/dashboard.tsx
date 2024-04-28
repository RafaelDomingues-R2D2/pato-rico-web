import { Helmet } from 'react-helmet-async'

import { MonthTransactionIncome } from './month-transaction-income'
import { MonthTransactionOutcome } from './month-transaction-outcome'
import { MonthTransactionOutcomeCategory } from './month-transaction-outcome-category'
import { MonthTransactionOutcomeTypeOfExpense } from './month-transaction-outcome-type-of-expense'
import { MonthTransactionTotal } from './month-transaction-total'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4">
          <MonthTransactionIncome />
          <MonthTransactionOutcome />
          <MonthTransactionTotal />
        </div>
        <div className="grid grid-cols-9 gap-4">
          <MonthTransactionOutcomeCategory />
          <MonthTransactionOutcomeTypeOfExpense />
        </div>
      </div>
    </>
  )
}
