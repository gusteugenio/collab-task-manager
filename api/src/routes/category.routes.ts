import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CategoryController } from '../controllers/category.controller.js'
import { authenticate } from './auth.middleware.js'
import { createCategorySchema } from '../schemas/category.schema.js'

const ErrorResponse = z.object({ error: z.string() })

export async function categoryRoutes(app: FastifyInstance) {
  const categoryController = new CategoryController()
  const api = app.withTypeProvider<ZodTypeProvider>()

  api.addHook('onRequest', authenticate)

  api.get('/', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      response: {
        200: z.object({ categories: z.array(z.any()) })
      }
    }
  }, categoryController.list.bind(categoryController))

  api.post('/', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      body: createCategorySchema,
      response: {
        201: z.any(),
        400: ErrorResponse
      }
    }
  }, categoryController.create.bind(categoryController))

  api.put('/:id', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      body: createCategorySchema,
      response: {
        200: z.any(),
        400: ErrorResponse,
        404: ErrorResponse
      }
    }
  }, categoryController.update.bind(categoryController))

  api.delete('/:id', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      response: {
        204: z.null(),
        404: ErrorResponse
      }
    }
  }, categoryController.delete.bind(categoryController))
}
