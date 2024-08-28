import { api } from '@/lib/axios'

export interface GetMonthTransactionOutcomeResponse {
  amount: string
  // lastAmount: number
}

interface GetMonthTransactionOutcomeQuery {
  from?: Date
  to?: Date
}

export async function getMonthTransactionOutcome({from, to}: GetMonthTransactionOutcomeQuery) {
  const response = await api.get<GetMonthTransactionOutcomeResponse>(
    '/metrics/month-transaction-outcome',{
      params: {
        from,
        to,
      }
    }
  )

  return response.data
}
