"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { login } from '@/lib/actions'
import { useAuth } from '@/hooks/AuthContext'

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Formato de correo electrónico inválido' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña es requerida' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login: authLogin } = useAuth()
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    
    try {
      const result = await login(formData)
      
      if (result.success && result.token) {
        // Usar el contexto de autenticación para procesar el token
        authLogin(result.token)
        
        toast({
          title: 'Sesión iniciada',
          description: 'Has iniciado sesión correctamente.',
        })
        
        // Redirigir al usuario
        router.push('/')
      }
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Correo o contraseña inválidos.',
        variant: 'destructive',
      })

      form.setError('root', {
        type: 'manual',
        message: error.message || 'Correo o contraseña inválidos.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form action={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </Button>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </Form>
  )
}