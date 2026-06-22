import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<Task>>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a task', async () => {
      const task = { id: 1, title: 'Test', completed: false, status: 'TODO' };
      repo.create.mockReturnValue(task as any);
      repo.save.mockResolvedValue(task as any);

      const result = await service.create('Test', false, 1);

      expect(repo.create).toHaveBeenCalledWith({
        title: 'Test',
        completed: false,
        user: { id: 1 },
      });
      expect(repo.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(task);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks for a user', async () => {
      const qb = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [{ id: 1, title: 'T1' }],
          1,
        ]),
      };
      repo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.findAll({} as any, 1);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(repo.createQueryBuilder).toHaveBeenCalledWith('task');
    });
  });

  describe('findOne', () => {
    it('should return a task by id and userId', async () => {
      const task = { id: 1, title: 'Test' };
      repo.findOneBy.mockResolvedValue(task as any);

      const result = await service.findOne('1', 1);

      expect(result).toEqual(task);
      expect(repo.findOneBy).toHaveBeenCalledWith({
        id: 1,
        user: { id: 1 },
      });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('99', 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update title and completed', async () => {
      const task = { id: 1, title: 'Old', completed: false };
      repo.findOneBy.mockResolvedValue(task as any);
      repo.save.mockResolvedValue({ ...task, title: 'New', completed: true } as any);

      const result = await service.update('1', 'New', true, 1);

      expect(result.title).toBe('New');
      expect(result.completed).toBe(true);
    });

    it('should throw NotFoundException if task not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update('99', 'x', false, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.delete('1', 1);

      expect(result).toEqual({ message: 'Task deleted successfully.' });
      expect(repo.delete).toHaveBeenCalledWith({ id: 1, user: { id: 1 } });
    });

    it('should throw NotFoundException if task not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete('99', 1)).rejects.toThrow(NotFoundException);
    });
  });
});
