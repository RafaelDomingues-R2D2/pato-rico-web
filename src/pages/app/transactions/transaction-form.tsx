import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { CreateTransaction } from '@/api/create-transaction'
import { getCategories } from '@/api/get-categories'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
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
  setIsFormOpen: (isOpen: boolean) => void
}

const transactionSchema = z.object({
  name: z.string().min(1, { message: 'Este campo é obrigatório' }),
  description: z.string(),
  date: z.string(),
  value: z.string().min(1, { message: 'Este campo é obrigatório' }),
  type: z.enum(['INCOME', 'OUTCOME']),
  paymentForm: z.enum(['CREDIT', 'MONEY', 'DEBIT', 'PIX']),
  categoryId: z.string().min(1, { message: 'Este campo é obrigatório' }),
})

type TransactionSchema = z.infer<typeof transactionSchema>

export function TransactionForm({ setIsFormOpen }: TransactionFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      // name: transaction?.name ?? '',
      // description: transaction?.description ?? '',
      // value: transaction?.value ?? 0,
      // date: '',
      // type: transaction?.type ?? 'OUTCOME',
      // paymentForm: transaction?.paymentForm ?? 'CREDIT',
      // categoryId: transaction?.categoryId ?? '',

      name: '',
      description: '',
      value: '',
      date: format(String(new Date()), 'yyyy-MM-dd'),
      type: 'OUTCOME',
      paymentForm: 'CREDIT',
      categoryId: '',
    },
  })

  const type = useWatch({ control, name: 'type' })

  const { data: categories } = useQuery({
    queryKey: ['categories', type],
    queryFn: () =>
      getCategories({
        type,
      }),
    enabled: Boolean(type),
  })

  const { mutateAsync: createTransaction } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
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
      })

      setIsFormOpen(false)
      toast.success('Transação criada!')
    } catch (err) {
      toast.error('Erro ao criar a transação')
    }
  }

  const handleDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      setValue('date', format(selectedDate, 'yyyy-MM-dd'))
    }
  }

  return (
    <DialogContent>
      <form
        onSubmit={handleSubmit(handleCreateTransaction)}
        className="flex flex-col gap-1"
      >
        <div className="mb-4 flex flex-col">
          <Label className="mb-2">Nome</Label>
          <Input
            id="name"
            type="text"
            autoCorrect="off"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2">Descrição</Label>
          <Input
            id="description"
            type="text"
            autoCorrect="off"
            {...register('description')}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2">Data</Label>
          <DatePicker onSelectDate={handleDateChange} today={true} />
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2">Tipo</Label>
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
                  className="mt-0.5 grid grid-cols-2 gap-1"
                >
                  <div className="mt-0.5 flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-solid p-1">
                    <RadioGroupItem
                      value={'INCOME'}
                      id="income-radio-group"
                      className="checked:peer checked:sr-only "
                    />
                    <CircleArrowUp className="text-green-500" />
                    <Label
                      htmlFor="income-radio-group"
                      className="cursor-pointer"
                    >
                      Entrada
                    </Label>
                  </div>
                  <div className="mt-0.5 flex cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-solid p-1">
                    <RadioGroupItem
                      value={'OUTCOME'}
                      id="outcome-radio-group"
                      className="peer sr-only"
                    />
                    <CircleArrowDown className="text-red-500" />
                    <Label
                      htmlFor="outcome-radio-group"
                      className="cursor-pointer"
                    >
                      Saída
                    </Label>
                  </div>
                </RadioGroup>
              )
            }}
          />
        </div>
        {type === 'OUTCOME' && (
          <div className="mb-4 flex flex-col">
            <Label className="mb-2">Forma de Pagamento</Label>

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
                      <RadioGroupItem value={'DEBIT'} id="income-radio-group" />
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
        <div className="mb-4 flex flex-col">
          <Label className="mb-2">Valor</Label>
          <Input id="value" type="number" {...register('value')} />
          {errors.value && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.value.message}
            </span>
          )}
        </div>
        <div className="mb-4 flex flex-col">
          <Label className="mb-2">Categoria</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field: { name, onChange, value, disabled } }) => {
              return (
                <>
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
                        categories?.categories?.map((category) => {
                          return (
                            <SelectItem key={category.id} value={category.id}>
                              {!category.reservationName ? (
                                <span>{category.name}</span>
                              ) : (
                                <span>
                                  {category.name} - {category.reservationName}
                                </span>
                              )}
                            </SelectItem>
                          )
                        })}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <span className="text-xs font-medium text-red-500 dark:text-red-400">
                      {errors.categoryId.message}
                    </span>
                  )}
                </>
              )
            }}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} className="w-[100%]">
            Criar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
