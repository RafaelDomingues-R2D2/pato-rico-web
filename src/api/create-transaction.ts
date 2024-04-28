import { api } from '@/lib/axios'

export interface CreateTransactionRequest {
  name: string
  description?: string
  date: string
  value: number
  type: string
  typeOfExpenseId: string | undefined
  categoryId: string
  paymentForm?: string
}

export async function CreateTransaction({
  name,
  description,
  date,
  value,
  type,
  typeOfExpenseId,
  categoryId,
  paymentForm,
}: CreateTransactionRequest) {
  await api.post('/transactions', {
    name,
    description,
    date,
    value,
    type,
    typeOfExpenseId,
    categoryId,
    paymentForm,
  })
}
