import { CategoryRepository } from '../repositories/category.repository.js'
import { TaskRepository } from '../repositories/task.repository.js'

export class TaskService {
  private taskRepository: TaskRepository
  private categoryRepository: CategoryRepository


  constructor() {
    this.taskRepository = new TaskRepository()
    this.categoryRepository = new CategoryRepository()
  }

  // Cria tarefa
  async createTask(userId: string, data: any) {
    if (data.categoryId) {
      const categoryExists = await this.categoryRepository.findById(data.categoryId)
      if (!categoryExists) {
        throw new Error('Categoria informada não existe.')
      }
    }

    return this.taskRepository.create({
      ...data,
      ownerId: userId
    })
  }

  // Lista tarefas do usuário
  async getUserTasks(userId: string, filters: any = {}) {
    const tasks = await this.taskRepository.findManyByUserId(userId, filters)

    return tasks.map(({ collaborators, category, ...task }) => ({
      ...task,
      category: category ? { id: category.id, name: category.name } : null,
      collaborators: collaborators.map(c => c.user)
    }))
  }

  // Atualiza tarefa
  async updateTask(taskId: string, userId: string, data: any) {
    const task = await this.taskRepository.findById(taskId)
    
    if (!task) {
      throw new Error('Tarefa não encontrada.')
    }

    const isOwner = task.ownerId === userId
    const isCollaborator = task.collaborators.some(c => c.userId === userId)

    if (!isOwner && !isCollaborator) {
      throw new Error('Sem permissão para editar esta tarefa.')
    }

    if (data.categoryId) {
      const categoryExists = await this.categoryRepository.findById(data.categoryId)
      if (!categoryExists) {
        throw new Error('Categoria informada não existe.')
      }
    }

    if (data.status === 'DONE' && task.status !== 'DONE') {
      data.completedAt = new Date()
    } else if (data.status && data.status !== 'DONE') {
      data.completedAt = null
    }

    return this.taskRepository.update(taskId, data)
  }

  // Deleta tarefa
  async deleteTask(taskId: string, userId: string) {
    const task = await this.taskRepository.findById(taskId)
    
    if (!task) {
      throw new Error('Tarefa não encontrada.')
    }

    if (task.ownerId !== userId) {
      throw new Error('Apenas o dono pode deletar a tarefa.')
    }

    return this.taskRepository.delete(taskId)
  }

  // Compartilha tarefa com outro usuário
  async shareTask(taskId: string, ownerId: string, targetUserId: string) {
    const task = await this.taskRepository.findById(taskId)

    if (!task) throw new Error('Tarefa não encontrada.')
    if (task.ownerId !== ownerId) throw new Error('Apenas o dono pode compartilhar esta tarefa.')
    if (ownerId === targetUserId) throw new Error('Você já é o dono desta tarefa.')

    const alreadyShared = task.collaborators.some(c => c.userId === targetUserId)
    if (alreadyShared) throw new Error('Tarefa já compartilhada com este usuário.')

    return this.taskRepository.addCollaborator(taskId, targetUserId)
  }

  // Retorna tasks sincronizadas
  async getSyncTasks(userId: string, lastSyncDate: string) {
    const lastSync = new Date(lastSyncDate)
    const tasks = await this.taskRepository.findUpdatedSince(userId, lastSync)

    return tasks.map(({ collaborators, category, ...task }) => ({
      ...task,
      category: category ? { id: category.id, name: category.name } : null,
      collaborators: collaborators.map(c => c.user)
    }))
  }
}
