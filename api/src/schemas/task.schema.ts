import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional()
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
  categoryId: z.string().uuid().optional()
})

export const shareTaskSchema = z.object({
  userId: z.string().uuid('ID de usuário inválido')
})

export const getTasksQuerySchema = z.object({
  status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
})
