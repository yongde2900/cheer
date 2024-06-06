import { GetAllUserDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';

export interface RedisUserDataSource {
	getById(id: number): Promise<UserEntity | null>;
	setUser(user: UserEntity): Promise<void>;
	unSetUser(id: number): Promise<void>;
	getAll(getAllUserDto: GetAllUserDto): Promise<UserEntity[] | null>;
	setAll(getAllUserDto: GetAllUserDto, users: UserEntity[]): Promise<void>;
	invalidateListCache(): Promise<void>;
	invalidateUserCache(id: number): Promise<void>;
}
