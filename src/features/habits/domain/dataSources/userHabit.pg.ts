import { UserHabitEntity } from '../entities/userHabit.entity';

export interface UserHabitPgDataSource {
	create(createDto: any): Promise<UserHabitEntity>;
	delete(id: number, userId: number): Promise<void>;
	getById(id: number): Promise<UserHabitEntity | null>;
	getAll(getAllDto: any): Promise<{ data: UserHabitEntity[]; total: number }>;
	edit(editDto: any): Promise<UserHabitEntity>;
}
