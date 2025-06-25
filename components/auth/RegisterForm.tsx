"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '@/graphql/mutations/auth'

const registerSchema = z.object({
  name: z.string().min(3).max(50),
  username: z.string().min(3).max(50),
  email: z.string().min(1).email(),
  nationality: z.string().min(2, { message: 'La nacionalidad es requerida' }),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, { message: 'Debe contener al menos una letra mayúscula' })
    .regex(/[a-z]/, { message: 'Debe contener al menos una letra minúscula' })
    .regex(/[0-9]/, { message: 'Debe contener al menos un número' }),
  confirmPassword: z.string().min(1),
  termsAndConditions: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      nationality: '',
      termsAndConditions: false,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:7080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          nationality: data.nationality,
          roles: ["USER"],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar el usuario");
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Bienvenido a Andariegos. Tu cuenta ha sido creada correctamente.",
      });

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const password = form.watch('password')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" autoComplete="name" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="juanperez123" autoComplete="username" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="tu@correo.com" type="email" autoComplete="email" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ NUEVO CAMPO: Nacionalidad */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidad</FormLabel>
              <FormControl>
                <Input placeholder="German" autoComplete="country-name" disabled={isLoading} {...field} />
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
                  <Input type={showPassword ? 'text' : 'password'} autoComplete="new-password" disabled={isLoading} {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
                  </Button>
                </div>
              </FormControl>
              {password && <PasswordStrengthIndicator password={password} />}
              <FormDescription>
                La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" disabled={isLoading} {...field} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termsAndConditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Acepto los <a href="/terminos" className="text-blue-600 hover:underline">términos y condiciones</a> y la <a href="/privacidad" className="text-blue-600 hover:underline">política de privacidad</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrarse
        </Button>
      </form>
    </Form>
  )
}