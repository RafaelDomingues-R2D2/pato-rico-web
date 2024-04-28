import { api } from '@/lib/axios'

export async function deleteTransaction(id: string) {
  await api.delete(`/transactions/${id}`)
}
