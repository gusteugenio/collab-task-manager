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
async findManyByUserId(userId: string) {
    return prisma.task.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } }
        ]
      },
      include: {
        category: true,
        collaborators: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
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
