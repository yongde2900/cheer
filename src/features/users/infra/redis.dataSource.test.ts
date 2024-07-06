import { Redis } from 'ioredis';
import { RedisUserDataSource } from '../domain/dataSource/redis.dataSource';
import { RedisUserDataSourceImpl } from './redis.dataSource.impl';

describe('RedisDataSource', () => {
	let dataSource: RedisUserDataSource;
	let mockRedis: jest.Mocked<Redis>;

	beforeAll(() => {
		mockRedis = {
			get: jest.fn(),
			set: jest.fn(),
			del: jest.fn()
		} as unknown as jest.Mocked<Redis>;

		dataSource = new RedisUserDataSourceImpl(mockRedis);
	});

	describe('getById', () => {
		it('should return null if user not found', async () => {
			mockRedis.get.mockResolvedValue(null);

			const result = await dataSource.getById(1);

			expect(result).toBeNull();
			expect(mockRedis.get).toHaveBeenCalledWith('user:1');
		});

		it('should return user if found', async () => {
			const user = {
				id: 1,
				name: 'John Doe',
				email: 'mail@mail.com'
			};
			mockRedis.get.mockResolvedValue(JSON.stringify(user));
		});
	});
});
