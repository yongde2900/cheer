import { Redis } from 'ioredis';
import { GetAllUserDto, UserEntity } from '../domain';
import { RedisUserDataSource } from '../domain/dataSource/redis.dataSource';
import { flattenObject } from '../../../utils/flattenObject';

export class RedisUserDataSourceImpl implements RedisUserDataSource {
	constructor(private readonly redis: Redis) {}
	async getById(id: number): Promise<UserEntity | null> {
		const user = await this.redis.get(this.getUserKey(id));
		try {
			if (!user) return null;
			const userEntity = UserEntity.fromJson(JSON.parse(user));
			return userEntity;
		} catch (err) {
			return null;
		}
	}

	async setUser(user: UserEntity): Promise<void> {
		await this.redis.set(this.getUserKey(user.id), JSON.stringify(user));
	}

	async unSetUser(id: number): Promise<void> {
		await this.redis.del(this.getUserKey(id));
	}

	async getAll(getAllUserDto: GetAllUserDto): Promise<{ data: UserEntity[]; total: number } | null> {
		const key = this.getUserListKey(getAllUserDto);
		const users = await this.redis.get(key);
		try {
			if (!users) return null;
			const usersEntity = JSON.parse(users);
			return usersEntity.map((user: Record<string, unknown>) => UserEntity.fromJson(user));
		} catch (err) {
			return null;
		}
	}

	async setAll(getAllUserDto: GetAllUserDto, users: { data: UserEntity[]; total: number }): Promise<void> {
		const key = this.getUserListKey(getAllUserDto);
		await this.redis.set(key, JSON.stringify(users.data));
	}

	async invalidateListCache(): Promise<void> {
		const keys = await this.redis.keys('user:list*');
		if (keys.length === 0) return;
		await this.redis.del(...keys);
	}

	async invalidateUserCache(id: number): Promise<void> {
		await this.redis.del(this.getUserKey(id));
	}

	private getUserKey(id: number): string {
		return `user:${id}`;
	}

	private getUserListKey(getAllUserDto: GetAllUserDto): string {
		let redisKey = `user:list`;
		const flattenDto = flattenObject(getAllUserDto);
		const sortedKeys = Object.keys(flattenDto).sort(([a], [b]) => a.localeCompare(b));
		for (const key of sortedKeys) {
			redisKey += `:${key}:${flattenDto[key]}`;
		}
		return redisKey;
	}
}
