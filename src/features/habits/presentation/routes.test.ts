import request from 'supertest';
import express from 'express';
import { HabitRoutes } from './routes';
import { HabitRepositoryImpl, HabitDataSourceImpl } from '../infra';

jest.mock('../infra/repository.impl.ts');
jest.mock('../infra/pq.dataSource.impl.ts');

const mockHabits = [
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

describe('HabitRoutes', () => {
	let app: express.Application;

	beforeEach(() => {
		app = express();
		HabitDataSourceImpl.prototype.getAll = jest.fn().mockResolvedValue(mockHabits);
		HabitRepositoryImpl.prototype.getAll = jest.fn().mockResolvedValue(mockHabits);
		app.use('/habits', HabitRoutes.routes);
	});

	it('should return all habits', async () => {
		const response = await request(app).get('/habits');

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockHabits);
	});
});
