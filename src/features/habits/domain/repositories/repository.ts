import { type HabitEntity } from '../entities/habit.entity';

export abstract class HabitRepository {
	// abstract save(habit: HabitEntity): Promise<void>;
	// abstract delete(habit: HabitEntity): Promise<void>;
	// abstract getById(id: number): Promise<HabitEntity | null>;
	abstract getAll(): Promise<HabitEntity[]>;
}
