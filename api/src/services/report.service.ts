import { TaskRepository } from '../repositories/task.repository.js'

export class ReportService {
  private taskRepository: TaskRepository

  constructor() {
    this.taskRepository = new TaskRepository()
  }

  // Gera relatórios com informações de tasks e categorias
  async generateReport(userId: string, periodInDays: number) {
    const tasks = await this.taskRepository.getTasksForReport(userId)

    // 1. Resumo de Tarefas
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'DONE').length
    // TODO + DOING
    const pending = total - completed 
    const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100)

    // 2. Progresso por Categoria
    const categoryMap: Record<string, { total: number; completed: number }> = {}
    
    tasks.forEach(task => {
      const catName = task.category?.name || 'Sem Categoria'
      if (!categoryMap[catName]) categoryMap[catName] = { total: 0, completed: 0 }
      
      categoryMap[catName].total += 1
      if (task.status === 'DONE') categoryMap[catName].completed += 1
    })

    const byCategory = Object.entries(categoryMap).map(([name, stats]) => ({
      category: name,
      total: stats.total,
      completed: stats.completed,
      completionPercentage: stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)
    }))

    // 3. Resumo por Período
    const period = new Date()
    period.setDate(period.getDate() - periodInDays)

    const createdInPeriod = tasks.filter(t => t.createdAt >= period).length
    const completedInPeriod = tasks.filter(t => t.completedAt && t.completedAt >= period).length

    // Retorna a estrutura final
    return {
      summary: { total, pending, completed, completionPercentage },
      byCategory,
      recentActivity: {
        period: periodInDays === 1 ? 'Último 1 dia' : `Últimos ${periodInDays} dias`,
        created: createdInPeriod,
        completed: completedInPeriod
      }
    }
  }
}
