import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user.controller.js'
import { authenticate } from './auth.middleware.js'

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController()

  app.addHook('onRequest', authenticate)

  app.get('/', userController.getUsers.bind(userController))
}
