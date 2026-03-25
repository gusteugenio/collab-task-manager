import { CategoryService } from '../category.service.js'
import { CategoryRepository } from '../../repositories/category.repository.js'

describe('CategoryService', () => {
	let categoryService: CategoryService

	beforeEach(() => {
		jest.restoreAllMocks()
		categoryService = new CategoryService()
	})

	describe('getCategories', () => {
		it('deve listar categorias com sucesso', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findAll').mockResolvedValue([
				{ id: 'cat-1', name: 'Categoria 1' },
			] as never)

			const result = await categoryService.getCategories()

			// Assert
			expect(CategoryRepository.prototype.findAll).toHaveBeenCalled()
			expect(result).toEqual([{ id: 'cat-1', name: 'Categoria 1' }])
		})

	})

	describe('createCategory', () => {
		it('deve criar categoria com sucesso', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findByName').mockResolvedValue(null)
			jest.spyOn(CategoryRepository.prototype, 'create').mockResolvedValue({ id: 'cat-1', name: 'Trabalho' } as never)

			const result = await categoryService.createCategory('Trabalho')

			// Assert
			expect(CategoryRepository.prototype.findByName).toHaveBeenCalledWith('Trabalho')
			expect(CategoryRepository.prototype.create).toHaveBeenCalledWith('Trabalho')
			expect(result).toEqual({ id: 'cat-1', name: 'Trabalho' })
		})

		it('deve lançar erro quando categoria já existir', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findByName').mockResolvedValue({ id: 'cat-1', name: 'Trabalho' } as never)

			// Assert
			await expect(categoryService.createCategory('Trabalho')).rejects.toThrow('Categoria já cadastrada.')
		})

	})

	describe('updateCategory', () => {
		it('deve atualizar categoria com sucesso', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue({ id: 'cat-1', name: 'Antigo' } as never)
			jest.spyOn(CategoryRepository.prototype, 'findByName').mockResolvedValue(null)
			jest.spyOn(CategoryRepository.prototype, 'update').mockResolvedValue({ id: 'cat-1', name: 'Novo' } as never)

			const result = await categoryService.updateCategory('cat-1', 'Novo')

			// Assert
			expect(CategoryRepository.prototype.findById).toHaveBeenCalledWith('cat-1')
			expect(CategoryRepository.prototype.findByName).toHaveBeenCalledWith('Novo')
			expect(CategoryRepository.prototype.update).toHaveBeenCalledWith('cat-1', 'Novo')
			expect(result).toEqual({ id: 'cat-1', name: 'Novo' })
		})

		it('deve permitir atualizar para o mesmo nome da própria categoria', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue({ id: 'cat-1', name: 'Mesmo Nome' } as never)
			jest.spyOn(CategoryRepository.prototype, 'findByName').mockResolvedValue({ id: 'cat-1', name: 'Mesmo Nome' } as never)
			jest.spyOn(CategoryRepository.prototype, 'update').mockResolvedValue({ id: 'cat-1', name: 'Mesmo Nome' } as never)

			const result = await categoryService.updateCategory('cat-1', 'Mesmo Nome')

			// Assert
			expect(CategoryRepository.prototype.update).toHaveBeenCalledWith('cat-1', 'Mesmo Nome')
			expect(result).toEqual({ id: 'cat-1', name: 'Mesmo Nome' })
		})

		it('deve lançar erro quando categoria não existir', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue(null)

			// Assert
			await expect(categoryService.updateCategory('cat-1', 'Novo')).rejects.toThrow('Categoria não encontrada.')
		})

		it('deve lançar erro quando já existir outra categoria com mesmo nome', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue({ id: 'cat-1', name: 'Antigo' } as never)
			jest.spyOn(CategoryRepository.prototype, 'findByName').mockResolvedValue({ id: 'cat-2', name: 'Novo' } as never)

			// Assert
			await expect(categoryService.updateCategory('cat-1', 'Novo')).rejects.toThrow('Já existe outra categoria com este nome.')
		})

	})

	describe('deleteCategory', () => {
		it('deve deletar categoria com sucesso', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue({ id: 'cat-1', name: 'Categoria' } as never)
			jest.spyOn(CategoryRepository.prototype, 'delete').mockResolvedValue({ id: 'cat-1', name: 'Categoria' } as never)

			const result = await categoryService.deleteCategory('cat-1')

			// Assert
			expect(CategoryRepository.prototype.findById).toHaveBeenCalledWith('cat-1')
			expect(CategoryRepository.prototype.delete).toHaveBeenCalledWith('cat-1')
			expect(result).toEqual({ id: 'cat-1', name: 'Categoria' })
		})

		it('deve lançar erro quando categoria não existir', async () => {
			// Mock
			jest.spyOn(CategoryRepository.prototype, 'findById').mockResolvedValue(null)

			// Assert
			await expect(categoryService.deleteCategory('cat-1')).rejects.toThrow('Categoria não encontrada.')
		})

	})
})
