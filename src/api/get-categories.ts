import { api } from '@/lib/axios'

export interface GetCategoriesQuery {
  type?: 'INCOME' | 'OUTCOME'
}

export interface GetCategoryResponse {
  categories: {
    id: string
    name: string
    description: string | null
    reservationName: string | null
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getCategories({ type }: GetCategoriesQuery) {
  const response = await api.get<GetCategoryResponse>(`/categories`, {
    params: {
      type,
    },
  })

  return response.data
}
