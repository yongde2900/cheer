import { AppError } from '../../../core';
import { CreateUserDto, EditUserDto, GetAllUserDto, UserEntity, UserRepository } from '../domain';
import { PqUserDataSource } from '../domain/dataSource/pq.dataSource';
import { RedisUserDataSource } from '../domain/dataSource/redis.dataSource';

export class UserRepositoryImpl implements UserRepository {
	constructor(
		private readonly pqDataSource: PqUserDataSource,
		private readonly redisDataSource: RedisUserDataSource
	) {}

	async create(createDto: CreateUserDto): Promise<UserEntity> {
		let user = await this.pqDataSource.getByEmail(createDto.email);
		if (user) {
			throw AppError.badRequest('User already exists');
		}

		user = await this.pqDataSource.create(createDto);
		await this.redisDataSource.invalidateListCache();
		return user;
	}

	async delete(id: number): Promise<void> {
		await this.pqDataSource.delete(id);
		await this.redisDataSource.invalidateUserCache(id);
	}

	async getById(id: number): Promise<UserEntity> {
		let user: UserEntity | null = await this.redisDataSource.getById(id);
		if (user) {
			return user;
		}

		user = await this.pqDataSource.getById(id);
		if (!user) {
			throw AppError.notFound('User not found');
		}

		await this.redisDataSource.setUser(user);
		return user;
	}

	async getAll(getAllUserDto: GetAllUserDto): Promise<{ data: UserEntity[]; total: number }> {
		let result = await this.redisDataSource.getAll(getAllUserDto);
		if (!result) {
			result = await this.pqDataSource.getAll(getAllUserDto);
			await this.redisDataSource.setAll(getAllUserDto, result);
		}
		return result;
	}

	async getByEmail(email: string): Promise<UserEntity | null> {
		return await this.pqDataSource.getByEmail(email);
	}

	async edit(editDto: EditUserDto): Promise<UserEntity> {
		const user = await this.pqDataSource.edit(editDto);
		await this.redisDataSource.invalidateUserCache(user.id);
		return user;
	}
}
