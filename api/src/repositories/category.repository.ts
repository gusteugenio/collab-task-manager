import { prisma } from '../lib/prisma.js'

export class CategoryRepository {

  // Busca todas as categorias
  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  }

  // Cria uma nova categoria
  async create(name: string) {
    return prisma.category.create({
      data: { name }
    })
  }

  // Busca por nome
  async findByName(name: string) {
    return prisma.category.findUnique({ where: { name } })
  }

  // Atualiza categoria
  async update(id: string, name: string) {
    return prisma.category.update({
      where: { id },
      data: { name }
    })
  }

  // Deleta categoria
  async delete(id: string) {
    return prisma.category.delete({ where: { id } })
  }

  // Busca por ID
  async findById(id: string) {
    return prisma.category.findUnique({ where: { id } })
  }
}
