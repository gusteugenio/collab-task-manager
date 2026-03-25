import { FastifyInstance } from 'fastify'
import { ReportController } from '../controllers/report.controller.js'
import { authenticate } from './auth.middleware.js'

export async function reportRoutes(app: FastifyInstance) {
  const reportController = new ReportController()

  app.addHook('onRequest', authenticate)

  // Rota principal do dashboard
  app.get('/', reportController.getReport.bind(reportController))
}
