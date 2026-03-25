import { FastifyRequest, FastifyReply } from 'fastify'
import { registerBodySchema, loginBodySchema } from '../schemas/auth.schema.js'
import { AuthService } from '../services/auth.service.js'


export class AuthController {
  private authService: AuthService
  
  constructor() {
    this.authService = new AuthService()
  }

  // Registra usuário
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, email, password } = registerBodySchema.parse(request.body)
      
      const user = await this.authService.registerUser({ name, email, password })

      return reply.status(201).send({
        message: 'Usuário criado com sucesso!',
        userId: user.id
      })
    } catch (error: any) {
      if (error.message === 'E-mail já cadastrado!') {
        return reply.status(400).send({ error: error.message })
      }
      throw error 
    }
  }

  // Faz login
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = loginBodySchema.parse(request.body)
      
      const user = await this.authService.login({ email, password })

      const token = request.server.jwt.sign(
        { name: user.name },
        { sub: user.id, expiresIn: '7d' }
      )

      return reply.status(200).send({ token })
    } catch (error: any) {
      if (error.message === 'Credenciais inválidas.') {
        return reply.status(401).send({ error: error.message })
      }
      throw error 
    }
  }
}
