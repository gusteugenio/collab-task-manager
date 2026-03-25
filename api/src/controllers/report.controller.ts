import { FastifyRequest, FastifyReply } from 'fastify'
import { ReportService } from '../services/report.service.js'
import { getReportSchema } from '../schemas/report.schema.js'


export class ReportController {
  private reportService: ReportService

  constructor() {
    this.reportService = new ReportService()
  }

  // Obtém informações para relatórios
  async getReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).sub
      const { periodInDays } = getReportSchema.parse(request.query)
      const report = await this.reportService.generateReport(userId, periodInDays)
      
      return reply.status(200).send(report)
    } catch (error: any) {
      throw error
    }
  }
}
