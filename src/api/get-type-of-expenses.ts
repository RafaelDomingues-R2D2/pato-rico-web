import { api } from '@/lib/axios'

export interface GetTypeOfExpenseQuery {
  pageIndex?: number | null
}

export interface GetTypeOfExpenseResponse {
  typeOfExpenses: {
    id: string
    name: string
    description: string | null
    percentage: string
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getTypeOfExpenses({ pageIndex }: GetTypeOfExpenseQuery) {
  const response = await api.get<GetTypeOfExpenseResponse>(
    `/type-of-expenses`,
    {
      params: {
        pageIndex,
      },
    },
  )

  return response.data
}
