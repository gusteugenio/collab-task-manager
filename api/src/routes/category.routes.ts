import { FastifyInstance } from 'fastify'
import { CategoryController } from '../controllers/category.controller.js'
import { authenticate } from './auth.middleware.js'

export async function categoryRoutes(app: FastifyInstance) {
  const categoryController = new CategoryController()

  app.addHook('onRequest', authenticate)

  app.get('/', categoryController.list.bind(categoryController))
  app.post('/', categoryController.create.bind(categoryController))
  app.put('/:id', categoryController.update.bind(categoryController))
  app.delete('/:id', categoryController.delete.bind(categoryController))
}
