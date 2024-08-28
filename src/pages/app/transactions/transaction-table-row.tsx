// import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { add, format } from 'date-fns'
import { Trash2 } from 'lucide-react'
// import { useState } from 'react'
import { toast } from 'sonner'

import { deleteTransaction } from '@/api/delete-transactions'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

// import { TransactionForm } from './transaction-form'

export interface TransactionTableRowProps {
  transaction: {
    id: string
    name: string
    description: string | null
    date: string
    value: number
    type: 'INCOME' | 'OUTCOME'
    paymentForm: 'CREDIT' | 'MONEY' | 'DEBIT' | 'PIX'
    category: string
    typeOfExpense: string
    typeOfExpensePercentage: number
  }
}

export function TransactionTablerRow({
  transaction,
}: TransactionTableRowProps) {
  const queryClient = useQueryClient()

  // const [isFormOpen, setIsFormOpen] = useState(false)

  const { mutateAsync: deleteTransactionFn, isPending: isDeletingTransaction } =
    useMutation({
      mutationFn: deleteTransaction,
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        toast.success('Transação excluida com sucesso!')
      },
    })

  return (
    <TableRow>
      <TableCell className="font-medium">{transaction.name}</TableCell>
      <TableCell
        className={`${transaction.type === 'INCOME' ? 'text-lime-600' : 'text-red-600'} font-medium`}
      >
        {transaction.type === 'OUTCOME' ? '- ' : ''}
        {(transaction.value / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </TableCell>
      <TableCell className="font-medium">{transaction.category}</TableCell>
      <TableCell className="font-medium">
        {transaction.typeOfExpense
          ? `${transaction.typeOfExpense} - ${transaction.typeOfExpensePercentage}%`
          : ''}
      </TableCell>

      <TableCell className="font-medium">
        {format(add(transaction.date, { hours: 3 }), 'dd/MM/yyyy')}
      </TableCell>
      <TableCell className="flex items-center">
        {/* <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="xs" className="mr-0.5 border-none">
              Editar
            </Button>
          </DialogTrigger>

          <TransactionForm
            open={isFormOpen}
            transactionId={transaction.transactionId}
          />
        </Dialog> */}
        <Button
          variant="outline"
          size="xs"
          className="border-none"
          onClick={() => deleteTransactionFn(transaction.id)}
          disabled={isDeletingTransaction}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
