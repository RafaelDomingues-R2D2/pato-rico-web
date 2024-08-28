import { api } from '@/lib/axios'

export interface GetMonthTransactionIncomeResponse {
  amount: string
  // lastAmount: number
}

interface GetMonthTransactionIncomeQuery {
  from?: Date
  to?: Date
}

export async function getMonthTransactionIncome({from, to}: GetMonthTransactionIncomeQuery) {
  const response = await api.get<GetMonthTransactionIncomeResponse>(
    '/metrics/month-transaction-income',
    {
      params: {
        from,
        to,
      }
    }
  )

  return response.data
}