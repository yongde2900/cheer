import { CreateUserDto, EditUserDto, GetAllUserDto } from '../dtos/';
import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
	create(createDto: CreateUserDto): Promise<UserEntity>;
	delete(id: number): Promise<void>;
	getById(id: number): Promise<UserEntity>;
	getAll(getAllUserDto: GetAllUserDto): Promise<{ data: UserEntity[]; total: number }>;
	getByEmail(email: string): Promise<UserEntity | null>;
	edit(editDto: EditUserDto): Promise<UserEntity>;
}
