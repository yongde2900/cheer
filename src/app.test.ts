import { AppDataSource } from '../src/db/postgres/data-source';
import redis from '../src/db/redis/redis';
import { Server } from '../src/server';
import { AppRoutes } from '../src/routers';
import main from '../src/app';
import { envs } from './core';

// Mock the dependencies
jest.mock('../src/db/postgres/data-source', () => ({
	AppDataSource: jest.fn().mockReturnValue({})
}));
jest.mock('../src/db/redis/redis', () => jest.fn().mockReturnValue({}));
jest.mock('../src/server');
jest.mock('../src/routers', () => ({
	AppRoutes: {
		routes: jest.fn().mockReturnValue([])
	}
}));

describe('Main Function', () => {
	let mockStart: jest.Mock;

	beforeEach(() => {
		mockStart = jest.fn();
		Server.prototype.start = mockStart;
	});

	it('should initialize the server with the correct configuration', async () => {
		main();

		expect(AppRoutes.routes).toHaveBeenCalledWith(AppDataSource, redis);
		expect(Server).toHaveBeenCalledWith({
			routes: expect.any(Array),
			port: envs.PORT,
			apiPrefix: envs.API_PREFIX,
			pgDataSource: AppDataSource,
			redisDataSource: redis
		});
		expect(mockStart).toHaveBeenCalled();
	});
});
