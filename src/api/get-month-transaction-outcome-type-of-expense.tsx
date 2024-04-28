import { api } from '@/lib/axios'

export type GetMonthTransactionOutcomeTypeOfExpenseResponse = Array<{
  name: string
  valor: number
  meta: number
}>

export async function getMonthTransactionOutcomeTypeOfExpense() {
  const response =
    await api.get<GetMonthTransactionOutcomeTypeOfExpenseResponse>(
      '/metrics/month-transaction-outcome-type-of-expense',
    )

  return response.data
}
