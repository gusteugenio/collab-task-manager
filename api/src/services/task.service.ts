import { TaskRepository } from '../repositories/task.repository.js'

export class TaskService {
  private taskRepository: TaskRepository

  constructor() {
    this.taskRepository = new TaskRepository()
  }

  // Cria tarefa
  async createTask(userId: string, data: any) {
    return this.taskRepository.create({
      ...data,
      ownerId: userId
    })
  }

  // Lista tarefas do usuário
  async getUserTasks(userId: string) {
    const tasks = await this.taskRepository.findManyByUserId(userId)

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
}
