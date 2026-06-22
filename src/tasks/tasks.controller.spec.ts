import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<Partial<TasksService>>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockService }],
    })
      .overrideGuard(require('../common/guards/jwt-auth.guard').JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call tasksService.create', async () => {
      const dto = { title: 'New Task', completed: false };
      const mockUser = { id: 1, email: 'test@test.com' };
      (service.create as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto as any, mockUser);

      expect(service.create).toHaveBeenCalledWith('New Task', false, 1);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should call tasksService.findAll with userId', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      const mockResult = { data: [], total: 0, page: 1, lastPage: 0 };
      (service.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.findAll({} as any, mockUser);

      expect(service.findAll).toHaveBeenCalledWith({}, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should call tasksService.findOne', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      const task = { id: 1, title: 'Test' };
      (service.findOne as jest.Mock).mockResolvedValue(task);

      const result = await controller.findOne('1', mockUser);

      expect(service.findOne).toHaveBeenCalledWith('1', 1);
      expect(result).toEqual(task);
    });
  });

  describe('update', () => {
    it('should call tasksService.update', async () => {
      const dto = { title: 'Updated', completed: true };
      const mockUser = { id: 1, email: 'test@test.com' };
      (service.update as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await controller.update('1', dto as any, mockUser);

      expect(service.update).toHaveBeenCalledWith('1', 'Updated', true, 1);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('delete', () => {
    it('should call tasksService.delete', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      (service.delete as jest.Mock).mockResolvedValue({
        message: 'Task deleted successfully.',
      });

      const result = await controller.delete('1', mockUser);

      expect(service.delete).toHaveBeenCalledWith('1', 1);
      expect(result).toEqual({ message: 'Task deleted successfully.' });
    });
  });
});
