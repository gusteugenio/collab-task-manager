import { TaskController } from '../task.controller.js'
import { TaskService } from '../../services/task.service.js'

describe('TaskController', () => {
  let taskController: TaskController
  let req: any
  let reply: any

  beforeEach(() => {
    jest.restoreAllMocks()

    taskController = new TaskController()

    req = {
      body: {},
      params: {},
      query: {},
      user: { sub: 'user-id' }
    }

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  })

  describe('create', () => {
    it('deve criar uma tarefa com sucesso e retornar status 201', async () => {
      // Mock
      req.body = { title: 'Nova Tarefa', description: 'Descrição da tarefa' }

      jest.spyOn(TaskService.prototype, 'createTask').mockResolvedValue({
        id: 'task-id',
        title: 'Nova Tarefa',
        description: 'Descrição da tarefa',
        status: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        categoryId: null,
        ownerId: 'user-id',
      })

      await taskController.create(req, reply)

      // Assert
      expect(TaskService.prototype.createTask).toHaveBeenCalledWith('user-id', req.body)
      expect(reply.status).toHaveBeenCalledWith(201)
      expect(reply.send).toHaveBeenCalledWith({
        id: 'task-id',
        title: 'Nova Tarefa',
        description: 'Descrição da tarefa',
        status: 'TODO',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        completedAt: null,
        categoryId: null,
        ownerId: 'user-id',
      })
    })

    it('deve retornar erro 400 se a categoria não existir', async () => {
      // Mock
      req.body = { title: 'Nova Tarefa', description: 'Descrição da tarefa' }

      jest.spyOn(TaskService.prototype, 'createTask').mockRejectedValue(new Error('Categoria informada não existe.'))

      await taskController.create(req, reply)

      // Assert
      expect(reply.status).toHaveBeenCalledWith(400)
      expect(reply.send).toHaveBeenCalledWith({ error: 'Categoria informada não existe.' })
    })
  })

  describe('list', () => {
    it('deve listar tarefas com sucesso e retornar status 200', async () => {
      // Mock
      req.query = { order: 'desc' };

      jest.spyOn(TaskService.prototype, 'getUserTasks').mockResolvedValue([
        {
          id: 'task-1',
          title: 'Tarefa 1',
          description: 'Descrição da tarefa 1',
          status: 'DONE',
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: new Date(),
          categoryId: 'category-1',
          ownerId: 'user-id',
          category: { id: 'category-1', name: 'Categoria 1' },
          collaborators: [
            { id: 'collab-1', name: 'Colaborador 1', email: 'colab1@example.com' },
          ],
        },
      ])

      await taskController.list(req, reply)

      // Assert
      expect(TaskService.prototype.getUserTasks).toHaveBeenCalledWith('user-id', req.query)
      expect(reply.status).toHaveBeenCalledWith(200)
      expect(reply.send).toHaveBeenCalledWith({
        tasks: [
          {
            id: 'task-1',
            title: 'Tarefa 1',
            description: 'Descrição da tarefa 1',
            status: 'DONE',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            completedAt: expect.any(Date),
            categoryId: 'category-1',
            ownerId: 'user-id',
            category: { id: 'category-1', name: 'Categoria 1' },
            collaborators: [
              { id: 'collab-1', name: 'Colaborador 1', email: 'colab1@example.com' },
            ],
          },
        ],
      })
    })

    describe('update', () => {
      it('deve atualizar uma tarefa com sucesso e retornar status 200', async () => {
        // Mock
        req.params = { id: 'task-id' }
        req.body = { title: 'Tarefa Atualizada' }

        jest.spyOn(TaskService.prototype, 'updateTask').mockResolvedValue({
          id: 'task-id',
          title: 'Tarefa Atualizada',
          description: 'Descrição atualizada',
          status: 'DOING',
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
          categoryId: null,
          ownerId: 'user-id',
        })

        await taskController.update(req, reply)

        // Assert
        expect(TaskService.prototype.updateTask).toHaveBeenCalledWith('task-id', 'user-id', req.body)
        expect(reply.status).toHaveBeenCalledWith(200)
        expect(reply.send).toHaveBeenCalledWith({
          id: 'task-id',
          title: 'Tarefa Atualizada',
          description: 'Descrição atualizada',
          status: 'DOING',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          completedAt: null,
          categoryId: null,
          ownerId: 'user-id',
        })
      })

      it('deve retornar erro 403 se o usuário não tiver permissão para atualizar a tarefa', async () => {
        // Mock
        req.params = { id: 'task-id' }
        req.body = { title: 'Tarefa Atualizada' }

        jest.spyOn(TaskService.prototype, 'updateTask').mockRejectedValue(new Error('Usuário não tem permissão para atualizar esta tarefa.'))

        await taskController.update(req, reply)

        // Assert
        expect(TaskService.prototype.updateTask).toHaveBeenCalledWith('task-id', 'user-id', req.body)
        expect(reply.status).toHaveBeenCalledWith(403)
        expect(reply.send).toHaveBeenCalledWith({ error: 'Usuário não tem permissão para atualizar esta tarefa.' })
      })

      it('deve retornar erro 400 se a categoria informada não existir', async () => {
        // Mock
        req.params = { id: 'task-id' };
        req.body = { title: 'Tarefa Atualizada', categoryId: '00000000-0000-0000-0000-000000000000' };

        jest.spyOn(TaskService.prototype, 'updateTask').mockRejectedValue(new Error('Categoria informada não existe.'));

        await taskController.update(req, reply);

        // Assert
        expect(TaskService.prototype.updateTask).toHaveBeenCalledWith('task-id', 'user-id', req.body);
        expect(reply.status).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({ error: 'Categoria informada não existe.' });
      });
    })

    describe('delete', () => {
      it('deve deletar uma tarefa com sucesso e retornar status 204', async () => {
        // Mock
        req.params = { id: 'task-id' }

        jest.spyOn(TaskService.prototype, 'deleteTask').mockResolvedValue({
          id: 'task-id',
          title: 'Tarefa Excluída',
          description: null,
          status: 'TODO',
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
          categoryId: null,
          ownerId: 'user-id',
        })

        await taskController.delete(req, reply)

        // Assert
        expect(TaskService.prototype.deleteTask).toHaveBeenCalledWith('task-id', 'user-id')
        expect(reply.status).toHaveBeenCalledWith(204)
        expect(reply.send).toHaveBeenCalled()
      })

      it('deve retornar erro 404 se a tarefa não for encontrada', async () => {
        // Mock
        req.params = { id: 'task-id' }

        jest.spyOn(TaskService.prototype, 'deleteTask').mockRejectedValue(new Error('Tarefa não encontrada.'))

        await taskController.delete(req, reply)

        // Assert
        expect(reply.status).toHaveBeenCalledWith(404)
        expect(reply.send).toHaveBeenCalledWith({ error: 'Tarefa não encontrada.' })
      })

      it('deve retornar erro 403 se o usuário não for o dono da tarefa', async () => {
        // Mock
        req.params = { id: 'task-id' };

        jest.spyOn(TaskService.prototype, 'deleteTask').mockRejectedValue(new Error('Apenas o dono pode deletar a tarefa.'));

        await taskController.delete(req, reply);

        // Assert
        expect(TaskService.prototype.deleteTask).toHaveBeenCalledWith('task-id', 'user-id');
        expect(reply.status).toHaveBeenCalledWith(403);
        expect(reply.send).toHaveBeenCalledWith({ error: 'Apenas o dono pode deletar a tarefa.' });
      });
    })

    describe('share', () => {
      it('deve compartilhar uma tarefa com sucesso e retornar status 201', async () => {
        // Mock
        req.params = { id: 'task-id' };
        req.body = { userId: '123e4567-e89b-12d3-a456-426614174000' };

        jest.spyOn(TaskService.prototype, 'shareTask').mockResolvedValue({
          addedAt: new Date(),
          taskId: 'task-id',
          userId: '123e4567-e89b-12d3-a456-426614174000',
        });

        await taskController.share(req, reply);

        // Assert
        expect(TaskService.prototype.shareTask).toHaveBeenCalledWith('task-id', 'user-id', '123e4567-e89b-12d3-a456-426614174000');
        expect(reply.status).toHaveBeenCalledWith(201);
        expect(reply.send).toHaveBeenCalledWith({ message: 'Tarefa compartilhada com sucesso!' });
      });

      it('deve retornar erro 403 se o usuário já for o dono da tarefa', async () => {
        // Mock
        req.params = { id: 'task-id' };
        req.body = { userId: '123e4567-e89b-12d3-a456-426614174000' };

        jest.spyOn(TaskService.prototype, 'shareTask').mockRejectedValue(new Error('O usuário já é o dono da tarefa.'));

        await taskController.share(req, reply);

        // Assert
        expect(TaskService.prototype.shareTask).toHaveBeenCalledWith('task-id', 'user-id', '123e4567-e89b-12d3-a456-426614174000');
        expect(reply.status).toHaveBeenCalledWith(403);
        expect(reply.send).toHaveBeenCalledWith({ error: 'O usuário já é o dono da tarefa.' });
      });

      it('deve retornar erro 400 se a tarefa já estiver compartilhada com o usuário', async () => {
        // Mock
        req.params = { id: 'task-id' };
        req.body = { userId: '123e4567-e89b-12d3-a456-426614174000' };

        jest.spyOn(TaskService.prototype, 'shareTask').mockRejectedValue(new Error('Tarefa já compartilhada com este usuário.'));

        await taskController.share(req, reply);

        // Assert
        expect(TaskService.prototype.shareTask).toHaveBeenCalledWith('task-id', 'user-id', '123e4567-e89b-12d3-a456-426614174000');
        expect(reply.status).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({ error: 'Tarefa já compartilhada com este usuário.' });
      });
    })

    describe('sync', () => {
      it('deve sincronizar tarefas com sucesso e retornar status 200', async () => {
        // Mock
        req.query = { lastSync: '2026-03-25T12:00:00Z' };

        jest.spyOn(TaskService.prototype, 'getSyncTasks').mockResolvedValue([
          {
            id: 'task-1',
            title: 'Tarefa 1',
            description: 'Descrição da tarefa 1',
            status: 'TODO',
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: null,
            categoryId: 'category-1',
            ownerId: 'user-id',
            category: { id: 'category-1', name: 'Categoria 1' },
            collaborators: [
              { id: 'collab-1', name: 'Colaborador 1', email: 'colab1@example.com' },
            ],
          },
        ]);

        await taskController.sync(req, reply);

        // Assert
        expect(TaskService.prototype.getSyncTasks).toHaveBeenCalledWith('user-id', '2026-03-25T12:00:00Z');
        expect(reply.status).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith({
          tasks: [
            {
              id: 'task-1',
              title: 'Tarefa 1',
              description: 'Descrição da tarefa 1',
              status: 'TODO',
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              completedAt: null,
              categoryId: 'category-1',
              ownerId: 'user-id',
              category: { id: 'category-1', name: 'Categoria 1' },
              collaborators: [
                { id: 'collab-1', name: 'Colaborador 1', email: 'colab1@example.com' },
              ],
            },
          ],
        });
      });
    });
  });
});
