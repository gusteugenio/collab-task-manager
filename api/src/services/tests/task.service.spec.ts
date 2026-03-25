import { TaskService } from '../task.service.js'
import { TaskRepository } from '../../repositories/task.repository.js'
import { CategoryRepository } from '../../repositories/category.repository.js'

describe('TaskService', () => {
	let taskService: TaskService

	beforeEach(() => {
		jest.restoreAllMocks()
		taskService = new TaskService()
	})

	describe('createTask', () => {
		it('deve criar tarefa com sucesso sem categoria', async () => {
			// Mock
			const payload = { title: 'Nova tarefa', description: 'Descrição' }

			jest.spyOn(TaskRepository.prototype, 'create').mockResolvedValue({
				id: 'task-id',
				ownerId: 'user-id',
				...payload,
			} as never)

			const result = await taskService.createTask('user-id', payload)

			// Assert
			expect(TaskRepository.prototype.create).toHaveBeenCalledWith({
				...payload,
				ownerId: 'user-id',
			})
			expect(result).toEqual({
				id: 'task-id',
				ownerId: 'user-id',
				...payload,
			})
		})

		it('deve criar tarefa com sucesso com categoria válida', async () => {
			// Mock
			const payload = { title: 'Nova tarefa', categoryId: 'category-id' }

			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue({ id: 'category-id' } as never)
			jest.spyOn(TaskRepository.prototype, 'create').mockResolvedValue({
				id: 'task-id',
				ownerId: 'user-id',
				...payload,
			} as never)

			const result = await taskService.createTask('user-id', payload)

			// Assert
			expect(CategoryRepository.prototype.findById).toHaveBeenCalledWith('category-id')
			expect(TaskRepository.prototype.create).toHaveBeenCalledWith({
				...payload,
				ownerId: 'user-id',
			})
			expect(result).toEqual({
				id: 'task-id',
				ownerId: 'user-id',
				...payload,
			})
		})

		it('deve lançar erro se categoria não existir', async () => {
			// Mock
			const payload = { title: 'Nova tarefa', categoryId: 'category-id' }

			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue(null)

			// Assert
			await expect(taskService.createTask('user-id', payload)).rejects.toThrow('Categoria informada não existe.')
		})

	})

	describe('getUserTasks', () => {
		it('deve retornar tarefas mapeadas com categoria e colaboradores', async () => {
			// Mock
			const repoTasks = [
				{
					id: 'task-1',
					title: 'Tarefa 1',
					category: { id: 'cat-1', name: 'Categoria 1' },
					collaborators: [{ user: { id: 'u-1', name: 'User 1', email: 'u1@email.com' } }],
				},
			]

			jest.spyOn(TaskRepository.prototype, 'findManyByUserId').mockResolvedValue(repoTasks as never)

			const result = await taskService.getUserTasks('user-id', { order: 'desc' })

			// Assert
			expect(TaskRepository.prototype.findManyByUserId).toHaveBeenCalledWith('user-id', { order: 'desc' })
			expect(result).toEqual([
				{
					id: 'task-1',
					title: 'Tarefa 1',
					category: { id: 'cat-1', name: 'Categoria 1' },
					collaborators: [{ id: 'u-1', name: 'User 1', email: 'u1@email.com' }],
				},
			])
		})

		it('deve retornar categoria nula e colaboradores vazios quando não houver dados relacionados', async () => {
			// Mock
			const repoTasks = [
				{
					id: 'task-1',
					title: 'Tarefa 1',
					category: null,
					collaborators: [],
				},
			]

			jest.spyOn(TaskRepository.prototype, 'findManyByUserId').mockResolvedValue(repoTasks as never)

			const result = await taskService.getUserTasks('user-id')

			// Assert
			expect(TaskRepository.prototype.findManyByUserId).toHaveBeenCalledWith('user-id', {})
			expect(result).toEqual([
				{
					id: 'task-1',
					title: 'Tarefa 1',
					category: null,
					collaborators: [],
				},
			])
		})

	})

	describe('updateTask', () => {
		it('deve atualizar tarefa com sucesso quando usuário for dono', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'user-id',
				status: 'TODO',
				collaborators: [],
			}
			const payload = { title: 'Atualizada' }

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(TaskRepository.prototype, 'update').mockResolvedValue({ id: 'task-id', ...payload } as never)

			const result = await taskService.updateTask('task-id', 'user-id', payload)

			// Assert
			expect(TaskRepository.prototype.findById).toHaveBeenCalledWith('task-id')
			expect(TaskRepository.prototype.update).toHaveBeenCalledWith('task-id', payload)
			expect(result).toEqual({ id: 'task-id', ...payload })
		})

		it('deve atualizar tarefa com sucesso quando usuário for colaborador', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'owner-id',
				status: 'TODO',
				collaborators: [{ userId: 'user-id' }],
			}
			const payload = { description: 'Nova descrição' }

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(TaskRepository.prototype, 'update').mockResolvedValue({ id: 'task-id', ...payload } as never)

			const result = await taskService.updateTask('task-id', 'user-id', payload)

			// Assert
			expect(TaskRepository.prototype.update).toHaveBeenCalledWith('task-id', payload)
			expect(result).toEqual({ id: 'task-id', ...payload })
		})

		it('deve definir completedAt quando status mudar para DONE', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'user-id',
				status: 'TODO',
				collaborators: [],
			}
			const payload = { status: 'DONE' }

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(TaskRepository.prototype, 'update').mockResolvedValue({ id: 'task-id', status: 'DONE' } as never)

			await taskService.updateTask('task-id', 'user-id', payload)

			// Assert
			expect(TaskRepository.prototype.update).toHaveBeenCalledWith(
				'task-id',
				expect.objectContaining({ status: 'DONE', completedAt: expect.any(Date) })
			)
		})

		it('deve limpar completedAt quando status deixar de ser DONE', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'user-id',
				status: 'DONE',
				collaborators: [],
			}
			const payload = { status: 'DOING' }

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(TaskRepository.prototype, 'update').mockResolvedValue({ id: 'task-id', status: 'DOING' } as never)

			await taskService.updateTask('task-id', 'user-id', payload)

			// Assert
			expect(TaskRepository.prototype.update).toHaveBeenCalledWith(
				'task-id',
				expect.objectContaining({ status: 'DOING', completedAt: null })
			)
		})

		it('deve validar categoria ao atualizar quando categoryId for enviado', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'user-id',
				status: 'TODO',
				collaborators: [],
			}
			const payload = { categoryId: 'cat-id' }

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue({ id: 'cat-id' } as never)
			jest.spyOn(TaskRepository.prototype, 'update').mockResolvedValue({ id: 'task-id', categoryId: 'cat-id' } as never)

			await taskService.updateTask('task-id', 'user-id', payload)

			// Assert
			expect(CategoryRepository.prototype.findById).toHaveBeenCalledWith('cat-id')
			expect(TaskRepository.prototype.update).toHaveBeenCalledWith('task-id', payload)
		})

		it('deve lançar erro quando tarefa não existir', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(null)

			// Assert
			await expect(taskService.updateTask('task-id', 'user-id', { title: 'x' })).rejects.toThrow('Tarefa não encontrada.')
		})

		it('deve lançar erro quando usuário não tiver permissão', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'owner-id',
				status: 'TODO',
				collaborators: [{ userId: 'other-id' }],
			}

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)

			// Assert
			await expect(taskService.updateTask('task-id', 'user-id', { title: 'x' })).rejects.toThrow('Sem permissão para editar esta tarefa.')
		})

		it('deve lançar erro quando categoria informada não existir', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'user-id',
				status: 'TODO',
				collaborators: [],
			}

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue(null)

			// Assert
			await expect(taskService.updateTask('task-id', 'user-id', { categoryId: 'cat-id' })).rejects.toThrow('Categoria informada não existe.')
		})

	})

	describe('deleteTask', () => {
		it('deve deletar tarefa com sucesso', async () => {
			// Mock
			const task = { id: 'task-id', ownerId: 'user-id' }

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(TaskRepository.prototype, 'delete').mockResolvedValue(task as never)

			const result = await taskService.deleteTask('task-id', 'user-id')

			// Assert
			expect(TaskRepository.prototype.delete).toHaveBeenCalledWith('task-id')
			expect(result).toEqual(task)
		})

		it('deve lançar erro quando tarefa não existir', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(null)

			// Assert
			await expect(taskService.deleteTask('task-id', 'user-id')).rejects.toThrow('Tarefa não encontrada.')
		})

		it('deve lançar erro quando usuário não for o dono', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue({ id: 'task-id', ownerId: 'owner-id' } as never)

			// Assert
			await expect(taskService.deleteTask('task-id', 'user-id')).rejects.toThrow('Apenas o dono pode deletar a tarefa.')
		})

	})

	describe('shareTask', () => {
		it('deve compartilhar tarefa com sucesso', async () => {
			// Mock
			const task = {
				id: 'task-id',
				ownerId: 'owner-id',
				collaborators: [{ userId: 'someone-id' }],
			}

			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(task as never)
			jest.spyOn(TaskRepository.prototype, 'addCollaborator').mockResolvedValue({ taskId: 'task-id', userId: 'target-id' } as never)

			const result = await taskService.shareTask('task-id', 'owner-id', 'target-id')

			// Assert
			expect(TaskRepository.prototype.addCollaborator).toHaveBeenCalledWith('task-id', 'target-id')
			expect(result).toEqual({ taskId: 'task-id', userId: 'target-id' })
		})

		it('deve lançar erro quando tarefa não existir', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue(null)

			// Assert
			await expect(taskService.shareTask('task-id', 'owner-id', 'target-id')).rejects.toThrow('Tarefa não encontrada.')
		})

		it('deve lançar erro quando usuário não for dono', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue({ id: 'task-id', ownerId: 'another-id', collaborators: [] } as never)

			// Assert
			await expect(taskService.shareTask('task-id', 'owner-id', 'target-id')).rejects.toThrow('Apenas o dono pode compartilhar esta tarefa.')
		})

		it('deve lançar erro quando alvo for o próprio dono', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue({ id: 'task-id', ownerId: 'owner-id', collaborators: [] } as never)

			// Assert
			await expect(taskService.shareTask('task-id', 'owner-id', 'owner-id')).rejects.toThrow('Você já é o dono desta tarefa.')
		})

		it('deve lançar erro quando tarefa já estiver compartilhada', async () => {
			// Mock
			jest.spyOn(TaskRepository.prototype, 'findById').mockResolvedValue({
				id: 'task-id',
				ownerId: 'owner-id',
				collaborators: [{ userId: 'target-id' }],
			} as never)

			// Assert
			await expect(taskService.shareTask('task-id', 'owner-id', 'target-id')).rejects.toThrow('Tarefa já compartilhada com este usuário.')
		})

	})

	describe('getSyncTasks', () => {
		it('deve retornar tarefas sincronizadas mapeadas', async () => {
			// Mock
			const repoTasks = [
				{
					id: 'task-1',
					title: 'Tarefa 1',
					category: { id: 'cat-1', name: 'Categoria 1' },
					collaborators: [{ user: { id: 'u-1', name: 'User 1', email: 'u1@email.com' } }],
				},
			]

			jest.spyOn(TaskRepository.prototype, 'findUpdatedSince').mockResolvedValue(repoTasks as never)

			const result = await taskService.getSyncTasks('user-id', '2026-03-25T12:00:00.000Z')

			// Assert
			expect(TaskRepository.prototype.findUpdatedSince).toHaveBeenCalledWith('user-id', expect.any(Date))
			expect(result).toEqual([
				{
					id: 'task-1',
					title: 'Tarefa 1',
					category: { id: 'cat-1', name: 'Categoria 1' },
					collaborators: [{ id: 'u-1', name: 'User 1', email: 'u1@email.com' }],
				},
			])
		})

	})
})
