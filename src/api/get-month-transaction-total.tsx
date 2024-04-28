import { api } from '@/lib/axios'

export interface GetMonthTransactionTotalResponse {
  amount: string
  // lastAmount: number
}

export async function getMonthTransactionTotal() {
  const response = await api.get<GetMonthTransactionTotalResponse>(
    '/metrics/month-transaction-total',
  )

  return response.data
}
