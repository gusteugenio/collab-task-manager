import { UserController } from '../user.controller.js'
import { UserService } from '../../services/user.service.js'

describe('UserController', () => {
  let userController: UserController
  let req: any
  let reply: any

  beforeEach(() => {
    jest.restoreAllMocks()

    userController = new UserController()

    req = {
      user: { sub: 'user-id' }
    }

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  describe('getUsers', () => {
    it('deve retornar a lista de usuários com sucesso e status 200', async () => {
      // Mock
      jest.spyOn(UserService.prototype, 'getUsers').mockResolvedValue([{ id: 'user-1', email: 'user-email@gmail.com', name: 'User One' }])

      await userController.getUsers(req, reply)

      // Assert
      expect(UserService.prototype.getUsers).toHaveBeenCalledWith('user-id')
      expect(reply.status).toHaveBeenCalledWith(200)
      expect(reply.send).toHaveBeenCalledWith({ users: [{ id: 'user-1', "email": "user-email@gmail.com", name: 'User One' }] })
    })

    it('deve retornar erro 500 se ocorrer um erro inesperado', async () => {
      // Mock
      jest.spyOn(UserService.prototype, 'getUsers').mockRejectedValue(new Error('Erro inesperado'))

      await expect(userController.getUsers(req, reply)).rejects.toThrow('Erro inesperado')
    })
  })
})
