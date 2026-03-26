import { AuthController } from '../auth.controller.js'
import { AuthService } from '../../services/auth.service.js'

describe('AuthController', () => {
  let authController: AuthController
  let req: any
  let reply: any

  beforeEach(() => {
    jest.restoreAllMocks()
    
    authController = new AuthController()
    
    req = {
      body: {},
      server: {
        jwt: {
          sign: jest.fn()
        }
      }
    }
    
    reply = {
      status: jest.fn().mockReturnThis(), 
      send: jest.fn()
    }
  })

  describe('register', () => {
    it('deve registrar o usuário com sucesso e retornar status 201', async () => {
      // Mock
      req.body = { name: 'Gustavo', email: 'teste@teste.com', password: '123456' }
      
      jest.spyOn(AuthService.prototype, 'registerUser').mockResolvedValue({ id: 'uuid-123' } as any)

      await authController.register(req, reply)

      // Assert
      expect(AuthService.prototype.registerUser).toHaveBeenCalledWith({
        name: 'Gustavo',
        email: 'teste@teste.com',
        password: '123456'
      })
      expect(reply.status).toHaveBeenCalledWith(201)
      expect(reply.send).toHaveBeenCalledWith({
        message: 'Usuário criado com sucesso!',
        userId: 'uuid-123'
      })
    })

    it('deve retornar 400 se o e-mail já estiver cadastrado', async () => {
      // Mock
      req.body = { name: 'Gustavo', email: 'teste@teste.com', password: '123456' }
      
      jest.spyOn(AuthService.prototype, 'registerUser').mockRejectedValue(new Error('E-mail já cadastrado!'))

      await authController.register(req, reply)

      // Assert
      expect(reply.status).toHaveBeenCalledWith(400)
      expect(reply.send).toHaveBeenCalledWith({ error: 'E-mail já cadastrado!' })
    })
  })

  describe('login', () => {
    it('deve fazer login com sucesso e retornar o token com status 200', async () => {
      // Mock
      req.body = { email: 'teste@teste.com', password: '123456' }
      
      jest.spyOn(AuthService.prototype, 'login').mockResolvedValue({ id: 'uuid-123', name: 'Gustavo', email: 'teste@teste.com' } as any)
      
      req.server.jwt.sign.mockReturnValue('fake-jwt-token')

      await authController.login(req, reply)

      // Assert
      expect(AuthService.prototype.login).toHaveBeenCalledWith({
        email: 'teste@teste.com',
        password: '123456'
      })
      expect(req.server.jwt.sign).toHaveBeenCalledWith(
        { name: 'Gustavo' },
        { sub: 'uuid-123', expiresIn: '7d' }
      )
      expect(reply.status).toHaveBeenCalledWith(200)
      expect(reply.send).toHaveBeenCalledWith({ 
        token: 'fake-jwt-token',
        user: {
          id: 'uuid-123',
          name: 'Gustavo',
          email: 'teste@teste.com'
        }
      })
    })

    it('deve retornar 401 se as credenciais forem inválidas', async () => {
      // Mock
      req.body = { email: 'teste@teste.com', password: '123456' }
      
      jest.spyOn(AuthService.prototype, 'login').mockRejectedValue(new Error('Credenciais inválidas.'))

      await authController.login(req, reply)

      // Assert
      expect(reply.status).toHaveBeenCalledWith(401)
      expect(reply.send).toHaveBeenCalledWith({ error: 'Credenciais inválidas.' })
    })
  })
})
