import { api } from '@/lib/axios'

export interface GetReservationResponse {
  reservations: {
    id: string
    name: string
    description: string | null
    goalValue: string
  }[]
}

export async function getReservations() {
  const response = await api.get<GetReservationResponse>(`/reservations`)

  return response.data
}
