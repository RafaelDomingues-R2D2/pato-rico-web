import { api } from '@/lib/axios'

export type GetMonthTransactionOutcomeReservationResponse = Array<{
  name: string
  value: number
  meta: number
}>

interface GetMonthTransactionOutcomeReservationQuery {
  from?: Date
  to?: Date
}

export async function getMonthTransactionOutcomeReservation({
  from,
  to,
}: GetMonthTransactionOutcomeReservationQuery) {
  const response = await api.get<GetMonthTransactionOutcomeReservationResponse>(
    '/metrics/month-transaction-outcome-reservation',
    {
      params: {
        from,
        to,
      },
    },
  )

  return response.data
}
