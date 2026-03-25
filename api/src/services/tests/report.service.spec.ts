import { ReportService } from '../report.service.js'
import { TaskRepository } from '../../repositories/task.repository.js'

describe('ReportService', () => {
	let reportService: ReportService

	beforeEach(() => {
		jest.restoreAllMocks()
		reportService = new ReportService()
	})

	describe('generateReport', () => {
		it('deve gerar relatório com sucesso para período maior que 1 dia', async () => {
			// Mock
			const now = new Date()
			const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
			const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)

			jest.spyOn(TaskRepository.prototype, 'getTasksForReport').mockResolvedValue([
				{
					id: 'task-1',
					status: 'DONE',
					category: { name: 'Trabalho' },
					createdAt: twoDaysAgo,
					completedAt: now,
				},
				{
					id: 'task-2',
					status: 'TODO',
					category: { name: 'Trabalho' },
					createdAt: now,
					completedAt: null,
				},
				{
					id: 'task-3',
					status: 'DOING',
					category: null,
					createdAt: tenDaysAgo,
					completedAt: null,
				},
			] as never)

			const result = await reportService.generateReport('user-id', 7)

			// Assert
			expect(TaskRepository.prototype.getTasksForReport).toHaveBeenCalledWith('user-id')
			expect(result.summary).toEqual({
				total: 3,
				pending: 2,
				completed: 1,
				completionPercentage: 33,
			})
			expect(result.byCategory).toEqual(
				expect.arrayContaining([
					{
						category: 'Trabalho',
						total: 2,
						completed: 1,
						completionPercentage: 50,
					},
					{
						category: 'Sem Categoria',
						total: 1,
						completed: 0,
						completionPercentage: 0,
					},
				])
			)
			expect(result.recentActivity).toEqual({
				period: 'Últimos 7 dias',
				created: 2,
				completed: 1,
			})
		})

		it('deve gerar relatório com período singular quando periodInDays for 1', async () => {
			// Mock
			const now = new Date()

			jest.spyOn(TaskRepository.prototype, 'getTasksForReport').mockResolvedValue([
				{
					id: 'task-1',
					status: 'DONE',
					category: null,
					createdAt: now,
					completedAt: now,
				},
			] as never)

			const result = await reportService.generateReport('user-id', 1)

			// Assert
			expect(result.recentActivity.period).toBe('Último 1 dia')
			expect(result.summary).toEqual({
				total: 1,
				pending: 0,
				completed: 1,
				completionPercentage: 100,
			})
		})

		it('deve retornar resumo zerado quando não houver tarefas', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'getTasksForReport').mockResolvedValue([])

			const result = await reportService.generateReport('user-id', 30)

			// Assert
			expect(result.summary).toEqual({
				total: 0,
				pending: 0,
				completed: 0,
				completionPercentage: 0,
			})
			expect(result.byCategory).toEqual([])
			expect(result.recentActivity.period).toBe('Últimos 30 dias')
		})

	})
})
