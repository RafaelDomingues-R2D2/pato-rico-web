import { api } from '@/lib/axios'

export interface GetMonthTransactionIncomeResponse {
  amount: string
  // lastAmount: number
}

export async function getMonthTransactionIncome() {
  const response = await api.get<GetMonthTransactionIncomeResponse>(
    '/metrics/month-transaction-income',
  )

  return response.data
}
