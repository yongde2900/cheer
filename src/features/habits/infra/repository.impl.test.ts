import { HabitDataSource, HabitEntity, HabitRepository } from '../domain';
import { HabitRepositoryImpl } from './';

const mockDataSource: jest.Mocked<HabitDataSource> = {
	getAll: jest.fn()
};

describe('HabitRepositoryImpl', () => {
	let repository: HabitRepository;
	beforeEach(() => {
		repository = new HabitRepositoryImpl(mockDataSource);
	});

	it('should return all habits from the data source', async () => {
		const habits: HabitEntity[] = [{ id: 1, name: 'Habit 1', description: 'Description 1' }];
		mockDataSource.getAll.mockResolvedValue(habits);

		const result = await repository.getAll();

		expect(result).toEqual(habits);
		expect(mockDataSource.getAll).toHaveBeenCalled();
	});

	it('should throw an error if the data source fails', async () => {
		const errorMessage = 'Error getting habits';
		mockDataSource.getAll.mockRejectedValue(new Error(errorMessage));
		await expect(repository.getAll()).rejects.toThrow(errorMessage);
		expect(mockDataSource.getAll).toHaveBeenCalled();
	});
});
