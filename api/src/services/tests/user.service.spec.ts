import { UserService } from '../user.service.js'
import { UserRepository } from '../../repositories/user.repository.js'

describe('UserService', () => {
	let userService: UserService

	beforeEach(() => {
		jest.restoreAllMocks()
		userService = new UserService()
	})

	describe('getUsers', () => {
		it('deve listar usuários com sucesso', async () => {
			// Mock
			jest.spyOn(UserRepository.prototype, 'getAll').mockResolvedValue([
				{ id: 'user-1', name: 'User One', email: 'user1@email.com' },
				{ id: 'user-2', name: 'User Two', email: 'user2@email.com' },
			] as never)

			const result = await userService.getUsers('owner-id')

			// Assert
			expect(UserRepository.prototype.getAll).toHaveBeenCalledWith('owner-id')
			expect(result).toEqual([
				{ id: 'user-1', name: 'User One', email: 'user1@email.com' },
				{ id: 'user-2', name: 'User Two', email: 'user2@email.com' },
			])
		})

	})
})
