import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { TaskController } from '../controllers/task.controller.js'
import { authenticate } from './auth.middleware.js'
import { 
  createTaskSchema, 
  getTasksQuerySchema, 
  shareTaskSchema, 
  syncTasksQuerySchema, 
  updateTaskSchema 
} from '../schemas/task.schema.js'

const ErrorResponse = z.object({ error: z.string() })
const MessageResponse = z.object({ message: z.string() })

export async function taskRoutes(app: FastifyInstance) {
  const taskController = new TaskController()
  const api = app.withTypeProvider<ZodTypeProvider>()

  api.addHook('onRequest', authenticate)

  api.get('/sync', {
    schema: {
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      querystring: syncTasksQuerySchema,
      response: {
        200: z.object({ tasks: z.array(z.any()) })
      }
    }
  }, taskController.sync.bind(taskController))

  api.post('/', {
    schema: {
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      body: createTaskSchema,
      response: {
        201: z.any(),
        400: ErrorResponse
      }
    }
  }, taskController.create.bind(taskController))

  api.get('/', {
    schema: {
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      querystring: getTasksQuerySchema,
      response: {
        200: z.object({ tasks: z.array(z.any()) })
      }
    }
  }, taskController.list.bind(taskController))

  api.put('/:id', {
    schema: {
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      body: updateTaskSchema,
      response: {
        200: z.any(),
        400: ErrorResponse,
        403: ErrorResponse,
        404: ErrorResponse
      }
    }
  }, taskController.update.bind(taskController))

  api.delete('/:id', {
    schema: {
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      response: {
        204: z.null(),
        403: ErrorResponse,
        404: ErrorResponse
      }
    }
  }, taskController.delete.bind(taskController))

  api.post('/:id/share', {
    schema: {
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      body: shareTaskSchema,
      response: {
        201: MessageResponse,
        400: ErrorResponse,
        403: ErrorResponse
      }
    }
  }, taskController.share.bind(taskController))
}
