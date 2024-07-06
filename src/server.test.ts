import request from 'supertest';
import { Server } from './server';
import { HttpCode } from './core/constants';
import { Router } from 'express';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';

jest.mock('typeorm', () => ({
	DataSource: jest.fn().mockImplementation(() => ({
		initialize: jest.fn().mockResolvedValue(true),
		destroy: jest.fn().mockResolvedValue(true)
	}))
}));

jest.mock('ioredis', () => ({
	Redis: jest.fn().mockImplementation(() => ({
		disconnect: jest.fn().mockResolvedValue(true)
	}))
}));

describe('Server', () => {
	let server: Server;

	const mockRouter = Router();
	mockRouter.get('/test', (_req, res) => {
		res.status(HttpCode.OK).send({ message: 'Hello World' });
	});

	const mockDataSource = new DataSource({
		type: 'postgres'
	}) as jest.Mocked<DataSource>;

	const mockRedis = new Redis() as jest.Mocked<Redis>;

	beforeAll(async () => {
		server = new Server({
			port: 2000,
			routes: mockRouter,
			apiPrefix: '/api',
			pqDataSource: mockDataSource,
			redisDataSource: mockRedis
		});
	});

	it('should initialize data sources', async () => {
		await server.start();
		expect(mockDataSource.initialize).toHaveBeenCalled();
	});

	it('should return 200 for GET /test', async () => {
		const res = await request(server['app']).get('/api/test').expect(HttpCode.OK);
		expect(res.body).toEqual({ message: 'Hello World' });
	});

	it('should disconnect from Redis on stop', async () => {
		await server.stop();
		expect(mockRedis.disconnect).toHaveBeenCalled();
	});
});
