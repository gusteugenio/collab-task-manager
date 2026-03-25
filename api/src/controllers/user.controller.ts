import { FastifyRequest, FastifyReply } from 'fastify'
import { UserService } from '../services/user.service.js'

export class UserController {
  private userService: UserService
  
  constructor() {
    this.userService = new UserService()
  }

  // Lista usuários para colaboração
  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).sub;
      const users = await this.userService.getUsers(userId);

      return reply.status(200).send({ users })
    } catch (error: any) {
      throw error
    }
  }
}
