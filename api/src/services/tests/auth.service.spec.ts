import bcrypt from 'bcrypt'
import { AuthService } from '../auth.service.js'
import { UserRepository } from '../../repositories/user.repository.js'

describe('AuthService', () => {
	let authService: AuthService

	beforeEach(() => {
		jest.restoreAllMocks()
		authService = new AuthService()
	})

	describe('registerUser', () => {
		it('deve registrar usuário com sucesso', async () => {
			// Mock
			const payload = { name: 'User One', email: 'user@email.com', password: '123456' }

			jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(null)
			jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never)
			jest.spyOn(UserRepository.prototype, 'create').mockResolvedValue({
				id: 'user-id',
				name: payload.name,
				email: payload.email,
				password: 'hashed-password',
			} as never)

			const result = await authService.registerUser(payload)

			// Assert
			expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(payload.email)
			expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, 10)
			expect(UserRepository.prototype.create).toHaveBeenCalledWith({
				name: payload.name,
				email: payload.email,
				password: 'hashed-password',
			})
			expect(result).toEqual({
				id: 'user-id',
				name: payload.name,
				email: payload.email,
				password: 'hashed-password',
			})
		})

		it('deve lançar erro quando e-mail já estiver cadastrado', async () => {
			// Mock
			const payload = { name: 'User One', email: 'user@email.com', password: '123456' }

			jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue({ id: 'user-id' } as never)

			// Assert
			await expect(authService.registerUser(payload)).rejects.toThrow('E-mail já cadastrado!')
			expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(payload.email)
		})

	})

	describe('login', () => {
		it('deve realizar login com sucesso', async () => {
			// Mock
			const payload = { email: 'user@email.com', password: '123456' }
			const user = {
				id: 'user-id',
				name: 'User One',
				email: payload.email,
				password: 'hashed-password',
			}

			jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(user as never)
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)

			const result = await authService.login(payload)

			// Assert
			expect(UserRepository.prototype.findByEmail).toHaveBeenCalledWith(payload.email)
			expect(bcrypt.compare).toHaveBeenCalledWith(payload.password, user.password)
			expect(result).toEqual(user)
		})

		it('deve lançar erro quando usuário não existir', async () => {
			// Mock
			const payload = { email: 'user@email.com', password: '123456' }

			jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(null)

			// Assert
			await expect(authService.login(payload)).rejects.toThrow('Credenciais inválidas.')
		})

		it('deve lançar erro quando senha for inválida', async () => {
			// Mock
			const payload = { email: 'user@email.com', password: '123456' }
			const user = {
				id: 'user-id',
				name: 'User One',
				email: payload.email,
				password: 'hashed-password',
			}

			jest.spyOn(UserRepository.prototype, 'findByEmail').mockResolvedValue(user as never)
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

			// Assert
			await expect(authService.login(payload)).rejects.toThrow('Credenciais inválidas.')
		})

	})
})
