import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-stats.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepostory: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepostory.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepostory.findOneBy({
      id: id,
    });

    if (!found) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }

    return found;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepostory.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepostory.save(task);

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepostory.createTask(createTaskDto);
  }
}
