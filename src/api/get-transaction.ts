import { api } from '@/lib/axios'

export interface getTransactionQuery {
  transactionId?: string
}

export interface GetTransactionResponse {
  id: string
  name: string
  description: string | null
  date: string
  value: number
  type: 'INCOME' | 'OUTCOME'
  paymentForm: 'CREDIT' | 'MONEY' | 'DEBIT' | 'PIX'
  categoryId: string
  categoryName: string
  reservationId: string
  resevationName: string
  resevationGoalValue: string
}

export async function getTransaction({ transactionId }: getTransactionQuery) {
  const response = await api.get<GetTransactionResponse>(
    `/transactions/${transactionId}`,
    {},
  )

  return response.data
}
