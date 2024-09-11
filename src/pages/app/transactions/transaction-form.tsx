import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  Banknote,
  CircleArrowDown,
  CircleArrowUp,
  CreditCard,
  Landmark,
} from 'lucide-react'
// import CurrencyFormat from 'react-currency-format'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
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
  const paymentForm = useWatch({ control, name: 'paymentForm' })

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

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setValue('date', format(selectedDate, 'yyyy-MM-dd'))
    }
  }

  return (
    <DialogContent className="min-w-96">
      <form
        onSubmit={handleSubmit(handleCreateTransaction)}
        className="flex flex-col gap-1"
      >
        <div className="mb-6 flex flex-col">
          <Label className="mb-2">Nome</Label>
          <Input
            id="name"
            type="text"
            autoCorrect="off"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
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

        <div className="mb-6 flex flex-col">
          <Label className="mb-2">Tipo</Label>
          <div>
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
                    <div>
                      <RadioGroupItem
                        value={'INCOME'}
                        id="income-radio-group"
                        className="sr-only "
                      />
                      <Label
                        htmlFor="income-radio-group"
                        className={`flex items-center justify-center cursor-pointer border-2 border-solid rounded-md gap-1 p-2 w-full ${type === 'INCOME' ? 'bg-green-700 border-green-700 text-white' : ''}`}
                      >
                        <CircleArrowUp
                          className={`text-green-500 ${type === 'INCOME' ? 'bg-green-700 text-white' : ''}`}
                        />
                        Entrada
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value={'OUTCOME'}
                        id="outcome-radio-group"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="outcome-radio-group"
                        className={`flex items-center justify-center cursor-pointer border-2 border-solid rounded-md gap-1 p-2 w-full ${type === 'OUTCOME' ? 'bg-red-700 border-red-700 text-white' : ''}`}
                      >
                        <CircleArrowDown
                          className={`text-red-500 ${type === 'OUTCOME' ? 'bg-red-700 text-white' : ''}`}
                        />
                        Saída
                      </Label>
                    </div>
                  </RadioGroup>
                )
              }}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="mb-6 mr-1 flex flex-col w-full">
            <Label className="mb-2">Data</Label>
            <DatePicker onSelectDate={handleDateChange} today={true} />
          </div>
          <div className="mb-6 flex flex-col w-full">
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
                      <SelectTrigger>
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
                      <span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
                        {errors.categoryId.message}
                      </span>
                    )}
                  </>
                )
              }}
            />
          </div>
        </div>

        {type === 'OUTCOME' && (
          <div className="mb-6 flex flex-col">
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
                    className="grid grid-cols-2 lg:grid-cols-4"
                  >
                    <div className="flex items-center w-full">
                      <RadioGroupItem
                        value={'CREDIT'}
                        id="credit-radio-group"
                        className="sr-only"
                      />

                      <Label
                        htmlFor="credit-radio-group"
                        className={`flex items-center justify-center cursor-pointer border-2 border-solid rounded-md gap-1 p-2 w-full ${paymentForm === 'CREDIT' ? 'bg-primary border-primary text-white' : ''}`}
                      >
                        <CreditCard
                          className={`text-primary ${paymentForm === 'CREDIT' ? 'bg-primary text-white' : ''}`}
                        />
                        Crédito
                      </Label>
                    </div>
                    <div className="flex items-center w-full">
                      <RadioGroupItem
                        value={'DEBIT'}
                        id="debit-radio-group"
                        className="sr-only"
                      />

                      <Label
                        htmlFor="debit-radio-group"
                        className={`flex items-center justify-center cursor-pointer border-2 border-solid rounded-md gap-1 p-2 w-full ${paymentForm === 'DEBIT' ? 'bg-primary border-primary text-white' : ''}`}
                      >
                        <CreditCard
                          className={`text-primary ${paymentForm === 'DEBIT' ? 'bg-primary text-white' : ''}`}
                        />
                        Débito
                      </Label>
                    </div>
                    <div className="flex items-center w-full">
                      <RadioGroupItem
                        value={'PIX'}
                        id="pix-radio-group"
                        className="sr-only"
                      />

                      <Label
                        htmlFor="pix-radio-group"
                        className={`flex items-center justify-center cursor-pointer border-2 border-solid rounded-md gap-1 p-2 w-full ${paymentForm === 'PIX' ? 'bg-primary border-primary text-white' : ''}`}
                      >
                        <Landmark
                          className={`text-primary ${paymentForm === 'PIX' ? 'bg-primary text-white' : ''}`}
                        />
                        PIX
                      </Label>
                    </div>
                    <div className="flex items-center w-full">
                      <RadioGroupItem
                        value={'MONEY'}
                        id="money-radio-group"
                        className="sr-only"
                      />

                      <Label
                        htmlFor="money-radio-group"
                        className={`flex items-center justify-center cursor-pointer border-2 border-solid rounded-md gap-1 p-2 w-full ${paymentForm === 'MONEY' ? 'bg-primary border-primary text-white' : ''}`}
                      >
                        <Banknote
                          className={`text-primary ${paymentForm === 'MONEY' ? 'bg-primary text-white' : ''}`}
                        />
                        Dinheiro
                      </Label>
                    </div>
                  </RadioGroup>
                )
              }}
            />
          </div>
        )}
        <div className="mb-8 flex flex-col">
          <Label className="mb-2">Valor</Label>
          <Controller
            name="value"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <NumericFormat
                placeholder="R$ 00,00"
                thousandSeparator="."
                decimalSeparator=","
                fixedDecimalScale
                decimalScale={2}
                prefix="R$ "
                value={value}
                onValueChange={(values) => onChange(values.value)}
                onBlur={onBlur}
                className="'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            )}
          />

          {errors.value && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400 absolute mt-16">
              {errors.value.message}
            </span>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            Criar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
