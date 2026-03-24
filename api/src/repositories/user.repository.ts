import { prisma } from '../lib/prisma.js'
import { Prisma } from '@prisma/client'

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }
}
