import { api } from '@/lib/axios'

export interface GetCategoriesQuery {
  pageIndex?: number | null
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

export async function getCategories({ pageIndex, type }: GetCategoriesQuery) {
  const response = await api.get<GetCategoryResponse>(`/categories`, {
    params: {
      pageIndex,
      type,
    },
  })

  return response.data
}
