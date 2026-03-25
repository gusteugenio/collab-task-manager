import { FastifyRequest, FastifyReply } from 'fastify'
import { createTaskSchema, getTasksQuerySchema, shareTaskSchema, updateTaskSchema } from '../schemas/task.schema.js'
import { TaskService } from '../services/task.service.js'

export class TaskController {
  private taskService: TaskService

  constructor() {
    this.taskService = new TaskService()
  }

  // Cria tarefa
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).sub
      const data = createTaskSchema.parse(request.body)
      
      const task = await this.taskService.createTask(userId, data)
      return reply.status(201).send(task)
    } catch (error: any) {
      if (error.message === 'Categoria informada não existe.') {
        return reply.status(400).send({ error: error.message })
      }
      throw error
    }
  }

  // Lista tarefas do usuário
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).sub
      const filters = getTasksQuerySchema.parse(request.query)
      
      const tasks = await this.taskService.getUserTasks(userId, filters)
      
      return reply.status(200).send({ tasks })
    } catch (error: any) {
      throw error
    }
  }

  // Atualiza tarefa
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).sub
      const { id } = request.params as { id: string }
      const data = updateTaskSchema.parse(request.body)
      
      const task = await this.taskService.updateTask(id, userId, data)
      return reply.status(200).send(task)
    } catch (error: any) {
      if (error.message === 'Tarefa não encontrada.') return reply.status(404).send({ error: error.message })
      if (error.message.includes('permissão')) return reply.status(403).send({ error: error.message })
      if (error.message === 'Categoria informada não existe.') return reply.status(400).send({ error: error.message })
      throw error
    }
  }

  // Deleta tarefa
  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).sub
      const { id } = request.params as { id: string }
      
      await this.taskService.deleteTask(id, userId)
      return reply.status(204).send()
    } catch (error: any) {
      if (error.message === 'Tarefa não encontrada.') return reply.status(404).send({ error: error.message })
      if (error.message.includes('Apenas o dono')) return reply.status(403).send({ error: error.message })
      throw error
    }
  }

  // Compartilha tarefa
  async share(request: FastifyRequest, reply: FastifyReply) {
    try {
      const ownerId = (request.user as any).sub
      const { id: taskId } = request.params as { id: string }
      const { userId: targetUserId } = shareTaskSchema.parse(request.body)

      await this.taskService.shareTask(taskId, ownerId, targetUserId)
      return reply.status(201).send({ message: 'Tarefa compartilhada com sucesso!' })
    } catch (error: any) {
      if (error.message.includes('Apenas o dono') || error.message.includes('já é o dono')) {
        return reply.status(403).send({ error: error.message })
      }
      if (error.message.includes('já compartilhada')) {
        return reply.status(400).send({ error: error.message })
      }
      throw error
    }
  }
}
