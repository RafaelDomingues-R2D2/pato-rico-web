import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

export interface TransactionTableRowProps {
  transaction: {
    transactionId: string
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
  return (
    <TableRow>
      <TableCell className="font-medium">{transaction.name}</TableCell>
      <TableCell className="font-medium">
        {(transaction.value / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </TableCell>
      <TableCell className="font-medium">{transaction.category}</TableCell>
      <TableCell className="font-medium">{`${transaction.typeOfExpense} - ${transaction.typeOfExpensePercentage}%`}</TableCell>

      <TableCell className="font-medium">
        {format(transaction.date, 'dd/MM/yyyy')}
      </TableCell>
      <TableCell className="flex items-center">
        <Button variant="outline" size="xs" className="border-none">
          <Trash2 className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
