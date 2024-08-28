import { api } from '@/lib/axios'

export type GetMonthTransactionOutcomeCategoryResponse = Array<{
  category: string
  amount: number
}>

interface GetMonthTransactionOutcomeCategoryQuery {
  from?: Date
  to?: Date
}

export async function getMonthTransactionOutcomeCategory({from, to}: GetMonthTransactionOutcomeCategoryQuery) {
  const response = await api.get<GetMonthTransactionOutcomeCategoryResponse>(
    '/metrics/month-transaction-outcome-category',{
      params: {
        from,
        to,
      }
    }
  )

  return response.data
}
