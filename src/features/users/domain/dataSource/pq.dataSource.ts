import { CreateUserDto, EditUserDto, GetAllUserDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';

export interface PqUserDataSource {
	create(createDto: CreateUserDto): Promise<UserEntity>;
	delete(id: number): Promise<void>;
	getById(id: number): Promise<UserEntity | null>;
	getAll(getAllUserDto: GetAllUserDto): Promise<UserEntity[]>;
	getByEmail(email: string): Promise<UserEntity | null>;
	edit(user: EditUserDto): Promise<UserEntity>;
}
