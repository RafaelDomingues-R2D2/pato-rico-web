import { api } from '@/lib/axios'

export type GetMonthTransactionOutcomeTypeOfExpenseResponse = Array<{
  name: string
  value: number
  meta: number
}>

interface GetMonthTransactionOutcomeTypeOfExpenseQuery {
  from?: Date
  to?: Date
}

export async function getMonthTransactionOutcomeTypeOfExpense({from, to}: GetMonthTransactionOutcomeTypeOfExpenseQuery) {
  const response =
    await api.get<GetMonthTransactionOutcomeTypeOfExpenseResponse>(
      '/metrics/month-transaction-outcome-type-of-expense',{
        params: {
          from,
          to,
        }
      }
    )

  return response.data
}
