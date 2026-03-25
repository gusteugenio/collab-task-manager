import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CategoryService } from '../services/category.service.js'
import { createCategorySchema } from '../schemas/category.schema.js'

export class CategoryController {
  private categoryService: CategoryService

  constructor() {
    this.categoryService = new CategoryService()
  }

  // Lista categorias
  async list(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoryService.getCategories()
    return reply.send({ categories })
  }

  // Cria categoria
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name } = createCategorySchema.parse(request.body)
      const category = await this.categoryService.createCategory(name)
      return reply.status(201).send(category)
    } catch (error: any) {
      if (error.message === 'Categoria já cadastrada.') {
        return reply.status(400).send({ error: error.message })
      }
      throw error
    }
  }

  // Atualiza categoria
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const { name } = createCategorySchema.parse(request.body)

      const category = await this.categoryService.updateCategory(id, name)
      return reply.status(200).send(category)
    } catch (error: any) {
      if (error.message === 'Categoria não encontrada.') return reply.status(404).send({ error: error.message })
      if (error.message.includes('Já existe')) return reply.status(400).send({ error: error.message })
      throw error
    }
  }

  // Deleta categoria
  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      await this.categoryService.deleteCategory(id)
      
      return reply.status(204).send()
    } catch (error: any) {
      if (error.message === 'Categoria não encontrada.') {
        return reply.status(404).send({ error: error.message })
      }

      throw error
    }
  }
}
