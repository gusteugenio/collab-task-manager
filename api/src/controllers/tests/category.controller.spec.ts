import { CategoryController } from '../category.controller.js'
import { CategoryService } from '../../services/category.service.js'

describe('CategoryController', () => {
  let categoryController: CategoryController
  let req: any
  let reply: any

  beforeEach(() => {
    jest.restoreAllMocks()

    categoryController = new CategoryController()

    req = {
      body: {},
      params: {}
    }

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  describe('list', () => {
    it('deve listar categorias com sucesso', async () => {
      // Mock
      jest.spyOn(CategoryService.prototype, 'getCategories').mockResolvedValue([{ id: 'cat-1', name: 'Categoria 1' }])

      await categoryController.list(req, reply)

      // Assert
      expect(reply.send).toHaveBeenCalledWith({ categories: [{ id: 'cat-1', name: 'Categoria 1' }] })
    })
  })

  describe('create', () => {
    it('deve criar uma categoria com sucesso e retornar status 201', async () => {
      // Mock
      req.body = { name: 'Categoria Teste' }

      jest.spyOn(CategoryService.prototype, 'createCategory').mockResolvedValue({ id: 'cat-id', name: 'Categoria Teste' })

      await categoryController.create(req, reply)

      // Assert
      expect(CategoryService.prototype.createCategory).toHaveBeenCalledWith('Categoria Teste')
      expect(reply.status).toHaveBeenCalledWith(201)
      expect(reply.send).toHaveBeenCalledWith({ id: 'cat-id', name: 'Categoria Teste' })
    })

    it('deve retornar erro 400 se a categoria já existir', async () => {
      // Mock
      req.body = { name: 'Categoria Existente' }

      jest.spyOn(CategoryService.prototype, 'createCategory').mockRejectedValue(new Error('Categoria já cadastrada.'))

      await categoryController.create(req, reply)

      // Assert
      expect(reply.status).toHaveBeenCalledWith(400)
      expect(reply.send).toHaveBeenCalledWith({ error: 'Categoria já cadastrada.' })
    })
  })

  describe('update', () => {
    it('deve atualizar uma categoria com sucesso e retornar status 200', async () => {
      // Mock
      req.params = { id: 'cat-id' }
      req.body = { name: 'Categoria Atualizada' }

      jest.spyOn(CategoryService.prototype, 'updateCategory').mockResolvedValue({ id: 'cat-id', name: 'Categoria Atualizada' })

      await categoryController.update(req, reply)

      // Assert
      expect(CategoryService.prototype.updateCategory).toHaveBeenCalledWith('cat-id', 'Categoria Atualizada')
      expect(reply.status).toHaveBeenCalledWith(200)
      expect(reply.send).toHaveBeenCalledWith({ id: 'cat-id', name: 'Categoria Atualizada' })
    })

    it('deve retornar erro 404 se a categoria não for encontrada', async () => {
      // Mock
      req.params = { id: 'invalid-id' }
      req.body = { name: 'Categoria Inexistente' }

      jest.spyOn(CategoryService.prototype, 'updateCategory').mockRejectedValue(new Error('Categoria não encontrada.'))

      await categoryController.update(req, reply)

      // Assert
      expect(reply.status).toHaveBeenCalledWith(404)
      expect(reply.send).toHaveBeenCalledWith({ error: 'Categoria não encontrada.' })
    })
  })

  describe('delete', () => {
    it('deve deletar uma categoria com sucesso e retornar status 204', async () => {
      // Mock
      req.params = { id: 'cat-id' }

      jest.spyOn(CategoryService.prototype, 'deleteCategory').mockResolvedValue({ id: 'cat-id', name: 'Categoria Teste' })

      await categoryController.delete(req, reply)

      // Assert
      expect(CategoryService.prototype.deleteCategory).toHaveBeenCalledWith('cat-id')
      expect(reply.status).toHaveBeenCalledWith(204)
      expect(reply.send).toHaveBeenCalled()
    })

    it('deve retornar erro 404 se a categoria não for encontrada', async () => {
      // Mock
      req.params = { id: 'invalid-id' }

      jest.spyOn(CategoryService.prototype, 'deleteCategory').mockRejectedValue(new Error('Categoria não encontrada.'))

      await categoryController.delete(req, reply)

      // Assert
      expect(reply.status).toHaveBeenCalledWith(404)
      expect(reply.send).toHaveBeenCalledWith({ error: 'Categoria não encontrada.' })
    })
  })
})
