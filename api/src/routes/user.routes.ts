import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UserController } from '../controllers/user.controller.js'
import { authenticate } from './auth.middleware.js'

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController()
  const api = app.withTypeProvider<ZodTypeProvider>()

  api.addHook('onRequest', authenticate)

  api.get('/', {
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({ users: z.array(z.any()) })
      }
    }
  }, userController.getUsers.bind(userController))
}
