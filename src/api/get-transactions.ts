import { api } from '@/lib/axios'

interface getTransactionsResponse {
  transactions: {
    transactionId: string
    name: string
    description: string | null
    date: string
    value: number
    type: 'INCOME' | 'OUTCOME'
    paymentForm: 'CREDIT' | 'MONEY' | 'DEBIT' | 'PIX'
    category: string
    typeOfExpense: string
    typeOfExpensePercentage: number
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export interface GetTransactionsQuery {
  pageIndex?: number | null
}

export async function getTransactions({ pageIndex }: GetTransactionsQuery) {
  const response = await api.get<getTransactionsResponse>('/transactions', {
    params: {
      pageIndex,
    },
  })
  return response.data
}
