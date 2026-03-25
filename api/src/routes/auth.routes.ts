import { FastifyInstance } from 'fastify'
import { AuthController } from '../controllers/auth.controller.js'

export async function authRoutes(app: FastifyInstance) {
  const authController = new AuthController()

  // Rotas de autenticação
  app.post('/register', authController.register.bind(authController))
  app.post('/login', authController.login.bind(authController))
}
