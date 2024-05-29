import { CreateUserDto } from '../dtos/createUser.dto';
import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
	abstract create(createDto: CreateUserDto): Promise<UserEntity>;
	abstract delete(id: number): Promise<void>;
	abstract getById(id: number): Promise<UserEntity | null>;
	abstract getAll(): Promise<UserEntity[]>;
	abstract getByEmail(email: string): Promise<UserEntity | null>;
	abstract editUser(id: number, user: UserEntity): Promise<UserEntity>;
}
