import { DialogContent } from "@/components/ui/dialog"

export interface TransactionFormProps {
  transactionId?: string
  open: boolean
}

export function TransactionForm({ transactionId, open }: TransactionFormProps) {
    const { data: transaction } = useQuery({
        queryKey: ['transaction', transactionId],
        queryFn: () => getTransaction({transactionId}),
        enabled: open
    })

        return (
    <DialogContent>

            <h1>New</h1>
            <h2>Transaction</h2>
    </DialogContent>

        )
}
