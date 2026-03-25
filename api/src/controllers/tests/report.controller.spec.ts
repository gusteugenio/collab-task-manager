import { ReportController } from '../report.controller.js'
import { ReportService } from '../../services/report.service.js'

describe('ReportController', () => {
  let reportController: ReportController
  let req: any
  let reply: any

  beforeEach(() => {
    jest.restoreAllMocks()

    reportController = new ReportController()

    req = {
      query: {},
      user: { sub: 'user-id' }
    }

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  describe('getReport', () => {
    it('deve retornar o relatório com sucesso e status 200', async () => {
      // Mock
      req.query = { periodInDays: 30 }

      const report = {
        summary: {
          total: 10,
          pending: 5,
          completed: 5,
          completionPercentage: 50
        },
        byCategory: [
          { category: 'Work', total: 5, completed: 3, completionPercentage: 60 },
          { category: 'Personal', total: 5, completed: 2, completionPercentage: 40 }
        ],
        recentActivity: {
          period: 'Últimos 30 dias',
          created: 5,
          completed: 3
        }
      };

      jest.spyOn(ReportService.prototype, 'generateReport').mockResolvedValue(report)

      await reportController.getReport(req, reply)

      // Assert
      expect(ReportService.prototype.generateReport).toHaveBeenCalledWith('user-id', 30)
      expect(reply.status).toHaveBeenCalledWith(200)
      expect(reply.send).toHaveBeenCalledWith(report)
    })

    it('deve retornar erro 400 se o período não for fornecido', async () => {
      // Mock
      req.query = {}

      jest.spyOn(ReportService.prototype, 'generateReport').mockRejectedValue(new Error('Período inválido.'))

      await expect(reportController.getReport(req, reply)).rejects.toThrow('Período inválido.')
    })
  })
})
