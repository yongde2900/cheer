import { CreateUserDto, EditUserDto } from '../dtos/';
import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
	abstract create(createDto: CreateUserDto): Promise<UserEntity>;
	abstract delete(id: number): Promise<void>;
	abstract getById(id: number): Promise<UserEntity | null>;
	abstract getAll(): Promise<UserEntity[]>;
	abstract getByEmail(email: string): Promise<UserEntity | null>;
	abstract edit(editDto: EditUserDto): Promise<UserEntity>;
}
