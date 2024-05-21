import { HabitDataSource } from '../domain/dataSources/dataSource';
import { HabitEntity } from '../domain/entities/habit.entity';

const HABITS_MOCK = [
	{
		id: 1,
		name: 'Reading',
		description: 'Read a book for 30 minutes',
		created_at: '2021-01-01T00:00:00.000Z',
		updated_at: '2021-01-01T00:00:00.000Z'
	},
	{
		id: 2,
		name: 'Running',
		description: 'Run 5 km',
		created_at: '2021-01-01T00:00:00.000Z',
		updated_at: '2021-01-01T00:00:00.000Z'
	},
	{
		id: 3,
		description: 'Meditate for 10 minutes',
		created_at: '2021-01-01T00:00:00.000Z',
		updated_at: '2021-01-01T00:00:00.000Z'
	}
];

export class HabitDataSourceImpl extends HabitDataSource {
	async getAll(): Promise<HabitEntity[]> {
		const habits = HABITS_MOCK.map((habit) => {
			return HabitEntity.fromJson(habit);
		});
		return habits;
	}
}
