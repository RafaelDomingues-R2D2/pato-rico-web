// import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { CreateTransaction } from '@/api/create-transaction'
import { getCategories } from '@/api/get-categories'
import { getTransaction } from '@/api/get-transaction'
import { getTypesOfExpenses } from '@/api/get-type-of-expenses'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface TransactionFormProps {
  transactionId?: string
  open: boolean
}

const transactionSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  date: z.string(),
  value: z.number(),
  type: z.enum(['INCOME', 'OUTCOME']),
  paymentForm: z.enum(['CREDIT', 'MONEY', 'DEBIT', 'PIX']),
  categoryId: z.string(),
  typeOfExpenseId: z.string(),
})

type TransactionSchema = z.infer<typeof transactionSchema>

interface transactionFormProps {
  open: boolean
  transactionId?: string
}

export function TransactionForm({ open, transactionId }: transactionFormProps) {
  const queryClient = useQueryClient()

  const { data: transaction } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransaction({ transactionId }),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<TransactionSchema>({
    // resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: transaction?.name ?? '',
      description: transaction?.description ?? '',
      value: transaction?.value ?? 0,
      date: transaction?.date ?? format(new Date(), 'yyyy-MM-dd'),
      type: transaction?.type ?? 'OUTCOME',
      paymentForm: transaction?.paymentForm ?? 'CREDIT',
      categoryId: transaction?.categoryId ?? '',
      typeOfExpenseId: transaction?.typeOfExpenseId ?? '',
    },
  })

  const type = useWatch({ control, name: 'type' })

  const { data: categories } = useQuery({
    queryKey: ['categories', type],
    queryFn: () =>
      getCategories({
        pageIndex: 0,
        type,
      }),
    enabled: Boolean(type),
  })

  const { data: typesOfExpenses } = useQuery({
    queryKey: ['typesOfExpenses'],
    queryFn: () => getTypesOfExpenses({ pageIndex: 0 }),
  })

  const { mutateAsync: createTransaction } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transação criada!')
    },
  })

  async function handleCreateTransaction({
    name,
    description,
    date,
    value,
    type,
    paymentForm,
    categoryId,
    typeOfExpenseId,
  }: TransactionSchema) {
    try {
      await createTransaction({
        name,
        description,
        date,
        value: 100 * Number(value),
        type,
        paymentForm,
        categoryId,
        typeOfExpenseId,
      })
    } catch (err) {
      toast.error('Erro ao criar a transação')
    }
  }

  return (
    <DialogContent>
      <div>
        <form onSubmit={handleSubmit(handleCreateTransaction)}>
          <div>
            <Label>Nome</Label>
            <Input
              id="name"
              type="text"
              autoCorrect="off"
              {...register('name')}
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Input
              id="description"
              type="text"
              autoCorrect="off"
              {...register('description')}
            />
          </div>
          <div>
            <Label>Data</Label>
            <Input id="date" type="date" {...register('date')} />
          </div>
          <div>
            <Label>Tipo</Label>
            <Controller
              name="type"
              control={control}
              defaultValue={'OUTCOME'}
              render={({ field: { name, onChange, value, disabled } }) => {
                return (
                  <RadioGroup
                    name={name}
                    onValueChange={onChange}
                    value={value}
                    disabled={disabled}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={'INCOME'}
                        id="income-radio-group"
                      />
                      <Label htmlFor="income-radio-group">Entrada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={'OUTCOME'}
                        id="outcome-radio-group"
                      />
                      <Label htmlFor="outcome-radio-group">Saída</Label>
                    </div>
                  </RadioGroup>
                )
              }}
            />
          </div>

          {type === 'OUTCOME' && (
            <div>
              <Label>Forma de Pagamento</Label>

              <Controller
                name="paymentForm"
                control={control}
                defaultValue={'CREDIT'}
                render={({ field: { name, onChange, value, disabled } }) => {
                  return (
                    <RadioGroup
                      name={name}
                      onValueChange={onChange}
                      value={value}
                      disabled={disabled}
                      className="flex"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={'CREDIT'}
                          id="income-radio-group"
                        />
                        <Label htmlFor="credit-radio-group">Crédito</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={'MONEY'}
                          id="outcome-radio-group"
                        />
                        <Label htmlFor="money-radio-group">Dinheiro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={'DEBIT'}
                          id="income-radio-group"
                        />
                        <Label htmlFor="debit-radio-group">Débito</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={'PIX'} id="pix-radio-group" />
                        <Label htmlFor="outcome-radio-group">PIX</Label>
                      </div>
                    </RadioGroup>
                  )
                }}
              />
            </div>
          )}
          <div>
            <Label>Valor</Label>
            <Input id="value" type="number" {...register('value')} />
          </div>
          <div>
            <Label>Categoria</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => {
                return (
                  <Select
                    name={name}
                    onValueChange={onChange}
                    value={value}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories &&
                        categories?.categories.map((category) => {
                          return (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          )
                        })}
                    </SelectContent>
                  </Select>
                )
              }}
            />
          </div>
          {type === 'OUTCOME' && (
            <div>
              <Label>Tipo de Gasto</Label>
              <Controller
                name="typeOfExpenseId"
                control={control}
                render={({ field: { name, onChange, value, disabled } }) => {
                  return (
                    <RadioGroup
                      name={name}
                      onValueChange={onChange}
                      value={value}
                      disabled={disabled}
                      className="flex"
                    >
                      {typesOfExpenses &&
                        typesOfExpenses?.typesOfExpenses.map((typeOfExpense) => {
                          return (
                            <div
                              key={typeOfExpense.id}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={typeOfExpense.id}
                                id={typeOfExpense.id}
                              />
                              <Label htmlFor={typeOfExpense.id}>
                                {`${typeOfExpense.name} - ${typeOfExpense.percentage}%`}
                              </Label>
                            </div>
                          )
                        })}
                    </RadioGroup>
                  )
                }}
              />
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Criar
            </Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  )
}
