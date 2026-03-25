import { prisma } from '../lib/prisma.js'
import { Prisma } from '@prisma/client'

export class UserRepository {

  // Encontra usuário pelo email
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  // Cria usuário
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }

  // Lista usuários para colaboração
  async getAll(userId: string) {
    return prisma.user.findMany({ 
      where: { NOT: { id: userId } },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
  }
}
