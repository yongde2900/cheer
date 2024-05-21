import { type HabitEntity } from '../entities/habit.entity';
import { type HabitRepository } from '../repositories/repository';

export interface GetHabitUseCase {
	execute: () => Promise<HabitEntity[]>;
}

export class GetAllHabit implements GetHabitUseCase {
	constructor(private habitRepository: HabitRepository) {}

	async execute(): Promise<HabitEntity[]> {
		return await this.habitRepository.getAll();
	}
}
