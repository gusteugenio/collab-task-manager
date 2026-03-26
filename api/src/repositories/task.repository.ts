import { prisma } from '../lib/prisma.js'
import { Prisma } from '../generated/client/index.js'

export class TaskRepository {
  
  // Cria tarefa
  async create(data: Prisma.TaskUncheckedCreateInput) {
    return prisma.task.create({ data })
  }

  // Busca tarefa por ID incluindo colaboradores
  async findById(id: string) {
    return prisma.task.findFirst({
      where: { id, deletedAt: null } as any,
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
      deletedAt: null,
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

  // Soft delete da tarefa
  async softDelete(id: string) {
    return prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() } as any
    })
  }

  // Adiciona um colaborador à tarefa
  async addCollaborator(taskId: string, userId: string) {
    return prisma.taskCollaborator.create({
      data: { taskId, userId }
    })
  }

  // Busca apenas as tarefas atualizadas após uma data específica
  async findUpdatedSince(userId: string, lastSync: Date) {
    return prisma.task.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } }
        ],
        updatedAt: {
          // greater than
          gt: lastSync
        }
      },
      include: {
        category: true,
        collaborators: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    })
  }

  // Busca dados completos para os relatórios analíticos
  async getTasksForReport(userId: string) {
    return prisma.task.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } }
        ],
        deletedAt: null
      } as any,
      include: {
        category: true
      }
    })
  }
}
