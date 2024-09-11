import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getTransactions } from '@/api/get-transactions'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TransactionFilters } from './transaction-filters'
import { TransactionForm } from './transaction-form'
import { TransactionTablerRow } from './transaction-table-row'
import { TransactionTableSkeleton } from './transaction-table-skeleton'

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const initialDate = searchParams.get('initialDate')
  const endDate = searchParams.get('endDate')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', initialDate, endDate, pageIndex],
    queryFn: () =>
      getTransactions({
        initialDate,
        endDate,
        pageIndex,
      }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', (Number(pageIndex) + 1).toString())

      return state
    })
  }

  return (
    <>
      <Helmet title="Transações" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
        <div className="space-y-2.5 ">
          <div className="flex items-center justify-between">
            <TransactionFilters />
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button size="xs" className="mr-0.5 border-none">
                  Nova Transação
                </Button>
              </DialogTrigger>

              <TransactionForm setIsFormOpen={setIsFormOpen} />
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[240px]">Nome</TableHead>
                  <TableHead className="w-[140px]">Valor</TableHead>
                  <TableHead className="w-[140px]">Categoria</TableHead>
                  <TableHead className="w-[140px]">Tipo de Gasto</TableHead>
                  <TableHead className="w-[140px]">Data</TableHead>
                  <TableHead className="w-[140px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTransactions && <TransactionTableSkeleton />}
                {result &&
                  result.transactions.map((transaction) => {
                    return (
                      <TransactionTablerRow
                        key={transaction.id}
                        transaction={transaction}
                      />
                    )
                  })}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  )
}
