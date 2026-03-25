import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user.controller.js'
import { authenticate } from './auth.middleware.js'

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController()

  // Rota para obter usuários para colaboração
  app.get('/', { onRequest: [authenticate] }, userController.getUsers.bind(userController))
}
