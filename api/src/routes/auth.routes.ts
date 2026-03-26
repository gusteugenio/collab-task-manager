import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AuthController } from '../controllers/auth.controller.js'
import { registerBodySchema, loginBodySchema } from '../schemas/auth.schema.js'

const ErrorResponse = z.object({ error: z.string() })

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController()
  const api = app.withTypeProvider<ZodTypeProvider>()

  api.post('/register', {
    schema: {
      tags: ['Auth'],
      body: registerBodySchema,
      response: {
        201: z.object({
          message: z.string(),
          userId: z.string()
        }),
        400: ErrorResponse
      }
    }
  }, authController.register.bind(authController))

  api.post('/login', {
    schema: {
      tags: ['Auth'],
      body: loginBodySchema,
      response: {
        200: z.object({
          token: z.string(),
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string()
          })
        }),
        401: ErrorResponse
      }
    }
  }, authController.login.bind(authController))
}
