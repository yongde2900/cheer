import { Repository } from 'typeorm';
import { AppDataSource } from '../../../db/postgres/data-source';
import { HabitDataSource, HabitEntity } from '../domain';
import { Habit } from '../../../db/postgres/models';

export class HabitDataSourceImpl extends HabitDataSource {
	private repository: Repository<HabitEntity>;
	constructor() {
		super();
		this.repository = AppDataSource.getRepository(Habit);
	}

	async getAll(): Promise<HabitEntity[]> {
		return await this.repository.find();
	}

	async getById(id: number): Promise<HabitEntity | null> {
		return await this.repository.findOneBy({ id });
	}

	async save(habit: HabitEntity): Promise<void> {
		await this.repository.save(habit);
	}

	async delete(habit: HabitEntity): Promise<void> {
		await this.repository.remove(habit);
	}
}
