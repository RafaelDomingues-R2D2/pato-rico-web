import { api } from '@/lib/axios'

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
    typeOfExpense: string
    typeOfExpenseGoalValue: number
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export interface GetTransactionsQuery {
  initialDate?: string | null
  endDate?: string | null
  pageIndex?: number | null
}

export async function getTransactions({
  initialDate,
  endDate,
  pageIndex,
}: GetTransactionsQuery) {
  const response = await api.get<GetTransactionsResponse>('/transactions', {
    params: {
      initialDate,
      endDate,
      pageIndex,
    },
  })
  return response.data
}
