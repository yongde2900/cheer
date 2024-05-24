import { HabitDataSource } from '../domain/dataSources/dataSource';
import { HabitEntity } from '../domain/entities/habit.entity';
import { HabitRepository } from '../domain/repositories/repository';

export class HabitRepositoryImpl extends HabitRepository {
	constructor(private readonly dataSource: HabitDataSource) {
		super();
	}
	async getAll(): Promise<HabitEntity[]> {
		return await this.dataSource.getAll();
	}

	async save(habit: HabitEntity): Promise<void> {
		return await this.dataSource.save(habit);
	}

	async delete(habit: HabitEntity): Promise<void> {
		return await this.dataSource.delete(habit);
	}

	async getById(id: number): Promise<HabitEntity | null> {
		return await this.dataSource.getById(id);
	}
}
