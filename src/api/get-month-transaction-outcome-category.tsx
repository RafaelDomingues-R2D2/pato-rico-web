import { api } from '@/lib/axios'

export type GetMonthTransactionOutcomeCategoryResponse = Array<{
  category: string
  amount: number
}>

export async function getMonthTransactionOutcomeCategory() {
  const response = await api.get<GetMonthTransactionOutcomeCategoryResponse>(
    '/metrics/month-transaction-outcome-category',
  )

  return response.data
}
