import { CategoryRepository } from '../repositories/category.repository.js'

export class CategoryService {
  private categoryRepository: CategoryRepository

  constructor() {
    this.categoryRepository = new CategoryRepository()
  }

  // Lista todas
  async getCategories() {
    return this.categoryRepository.findAll()
  }

  // Cria categoria validando se já existe
  async createCategory(name: string) {
    const categoryExists = await this.categoryRepository.findByName(name)

    if (categoryExists) {
      throw new Error('Categoria já cadastrada.')
    }

    return this.categoryRepository.create(name)
  }

  // Atualiza categoria
  async updateCategory(id: string, name: string) {
    const category = await this.categoryRepository.findById(id)
    if (!category) throw new Error('Categoria não encontrada.')

    const nameExists = await this.categoryRepository.findByName(name)
    if (nameExists && nameExists.id !== id) {
      throw new Error('Já existe outra categoria com este nome.')
    }

    return this.categoryRepository.update(id, name)
  }

  // Deleta categoria
  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id)

    if (!category) {
      throw new Error('Categoria não encontrada.')
    }

    return this.categoryRepository.delete(id)
  }
}
