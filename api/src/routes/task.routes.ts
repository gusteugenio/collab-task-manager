import { FastifyInstance } from 'fastify'
import { TaskController } from '../controllers/task.controller.js'
import { authenticate } from './auth.middleware.js'

export async function taskRoutes(app: FastifyInstance) {
  const taskController = new TaskController()

  // Todas as rotas de tarefas precisam de autenticação
  app.addHook('onRequest', authenticate)

  app.post('/', taskController.create.bind(taskController))
  app.get('/', taskController.list.bind(taskController))
  app.put('/:id', taskController.update.bind(taskController))
  app.delete('/:id', taskController.delete.bind(taskController))
  app.post('/:id/share', taskController.share.bind(taskController))
}
