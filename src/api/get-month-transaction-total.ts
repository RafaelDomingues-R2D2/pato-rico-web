import { api } from '@/lib/axios'

export interface GetMonthTransactionTotalResponse {
  amount: string
  // lastAmount: number
}

interface GetMonthTransactionTotalQuery {
  from?: Date
  to?: Date
}

export async function getMonthTransactionTotal({from, to}: GetMonthTransactionTotalQuery) {
  const response = await api.get<GetMonthTransactionTotalResponse>(
    '/metrics/month-transaction-total',{
      params: {
        from,
        to,
      }
    }
  )

  return response.data
}
