import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ReportController } from '../controllers/report.controller.js'
import { authenticate } from './auth.middleware.js'
import { getReportSchema } from '../schemas/report.schema.js'

export async function reportRoutes(app: FastifyInstance) {
  const reportController = new ReportController()
  const api = app.withTypeProvider<ZodTypeProvider>()

  api.addHook('onRequest', authenticate)

  api.get('/', {
    schema: {
      tags: ['Reports'],
      security: [{ bearerAuth: [] }],
      querystring: getReportSchema,
      response: {
        200: z.any()
      }
    }
  }, reportController.getReport.bind(reportController))
}
