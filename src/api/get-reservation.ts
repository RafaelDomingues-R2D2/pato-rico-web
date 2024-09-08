import { api } from '@/lib/axios'

export interface GetReservationResponse {
  reservation: {
    id: string
    name: string
    description: string | null
    goalValue: string
  }[]
}

export async function getReservation() {
  const response = await api.get<GetReservationResponse>(`/reservation`)

  return response.data
}
