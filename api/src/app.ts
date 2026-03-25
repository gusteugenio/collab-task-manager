import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import 'dotenv/config'
import { authRoutes } from './routes/auth.routes.js'
import { userRoutes } from './routes/user.routes.js'
import { taskRoutes } from './routes/task.routes.js'
import { categoryRoutes } from './routes/category.routes.js'

export const app = Fastify({ logger: true })

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definida')
}

// Registra o JWT
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
})

// Registra as rotas de autenticação
app.register(authRoutes, { prefix: '/auth' })

// Registra as rotas de usuário
app.register(userRoutes, { prefix: '/users' })

// Registra as rotas de tasks
app.register(taskRoutes, { prefix: '/tasks' })

// Registra as rotas de categorias
app.register(categoryRoutes, { prefix: '/categories' })

// Tratamento global de erros
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação.',
      issues: error.format()
    })
  }

  app.log.error(error)
  return reply.status(500).send({ message: 'Erro interno do servidor.' })
})
