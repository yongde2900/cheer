import { GetAllUserDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';

export interface UserRedisDataSource {
	getById(id: number): Promise<UserEntity | null>;
	setUser(user: UserEntity): Promise<void>;
	unSetUser(id: number): Promise<void>;
	getAll(getAllUserDto: GetAllUserDto): Promise<{ data: UserEntity[]; total: number } | null>;
	setAll(getAllUserDto: GetAllUserDto, users: { data: UserEntity[]; total: number }): Promise<void>;
	invalidateListCache(): Promise<void>;
	invalidateUserCache(id: number): Promise<void>;
}
