import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const signInForm = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'Por fover, insira a sua senha' }),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>({
    defaultValues: { email: searchParams.get('email') ?? '' },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
    onSuccess: async () => {},
  })

  async function handleSignIn(data: SignInForm) {
    try {
      const result = await authenticate({
        email: data.email,
        password: data.password,
      })

      console.log(result.data.token)
      Cookies.set('pato-rico', result.data.token, { expires: 7, path: '/' })
      navigate('/', { replace: true })
    } catch {
      toast.error('Credenciais inválidas.')
    }
  }
  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        {/* <Button variant={'link'} asChild className="absolute right-8 top-8">
          <Link to="/sign-up">Se cadastre aqui!</Link>
        </Button> */}
        <div className="flex w-[320px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Organize a sua vaida financeira!
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Sua senha</Label>
              <Input id="password" type="password" {...register('password')} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
