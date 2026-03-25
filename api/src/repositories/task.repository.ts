import { prisma } from '../lib/prisma.js'
import { Prisma } from '@prisma/client'

export class TaskRepository {
  
  // Cria tarefa
  async create(data: Prisma.TaskUncheckedCreateInput) {
    return prisma.task.create({ data })
  }

  // Busca tarefa por ID incluindo colaboradores
  async findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: { collaborators: true }
    })
  }

  // Lista tarefas do usuário (criadas ou compartilhadas com ele)
  async findManyByUserId(userId: string, filters: any = {}) {
    const baseCondition = {
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId } } }
      ]
    }

    const where: Prisma.TaskWhereInput = {
      ...baseCondition,
      ...(filters.status && { status: filters.status }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.search && {
        title: { contains: filters.search, mode: 'insensitive' }
      })
    }

    const orderDirection = filters.order || 'desc'

    return prisma.task.findMany({
      where,
      include: {
        category: true,
        collaborators: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      },
      orderBy: { createdAt: orderDirection }
    })
  }

  // Atualiza tarefa
  async update(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({ where: { id }, data })
  }

  // Deleta tarefa
  async delete(id: string) {
    return prisma.task.delete({ where: { id } })
  }

  // Adiciona um colaborador à tarefa
  async addCollaborator(taskId: string, userId: string) {
    return prisma.taskCollaborator.create({
      data: { taskId, userId }
    })
  }
}
