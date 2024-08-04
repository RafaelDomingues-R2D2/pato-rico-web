import { api } from '@/lib/axios'

export interface GetTypeOfExpenseResponse {
  typesOfExpense: {
    id: string
    name: string
    description: string | null
    goalValue: string
  }[]
}

export async function getTypesOfExpense() {
  const response = await api.get<GetTypeOfExpenseResponse>(
    `/types-of-expense`,
    
  )

  return response.data
}
