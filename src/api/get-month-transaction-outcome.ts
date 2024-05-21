import { api } from '@/lib/axios'

export interface GetMonthTransactionOutcomeResponse {
  amount: string
  // lastAmount: number
}

export async function getMonthTransactionOutcome() {
  const response = await api.get<GetMonthTransactionOutcomeResponse>(
    '/metrics/month-transaction-outcome',
  )

  return response.data
}
