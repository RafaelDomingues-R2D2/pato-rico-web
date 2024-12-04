import { api } from '@/lib/axios'

export interface GetTransactionsQuery {
  initialDate?: string | null
  endDate?: string | null
  categoryId?: string | null
  pageIndex?: number | null
}
export interface GetTransactionsResponse {
  transactions: {
    id: string
    name: string
    description: string | null
    date: string
    value: number
    type: 'INCOME' | 'OUTCOME'
    paymentForm: 'CREDIT' | 'MONEY' | 'DEBIT' | 'PIX'
    category: string
    reservation: string
    reservationGoalValue: number
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getTransactions({
  initialDate,
  endDate,
  categoryId,
  pageIndex,
}: GetTransactionsQuery) {
  const response = await api.get<GetTransactionsResponse>('/transactions', {
    params: {
      initialDate,
      endDate,
      categoryId,
      pageIndex,
    },
  })
  return response.data
}
