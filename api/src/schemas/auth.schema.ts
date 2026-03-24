import { z } from 'zod'

export const registerBodySchema = z.object({
  name: z.string().min(2, 'O nome precisa ter pelo menos 2 caracteres'),
  email: z.string().email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha precisa ter no mínimo 6 caracteres')
})

export const loginBodySchema = z.object({
  email: z.string().email('Formato de e-mail inválido'),
  password: z.string()
})
