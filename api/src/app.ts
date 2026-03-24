import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import 'dotenv/config'
import { authRoutes } from './routes/auth.routes.js'

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
