import { PgDataSource } from '../../../shared/domain/dataSource/pg';
import { CreateUserDto, EditUserDto, GetAllUserDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';

export interface UserPgDataSource extends PgDataSource<UserEntity> {
	create(createDto: CreateUserDto): Promise<UserEntity>;
	getAll(getAllUserDto: GetAllUserDto): Promise<{ data: UserEntity[]; total: number }>;
	getByEmail(email: string): Promise<UserEntity | null>;
	edit(user: EditUserDto): Promise<UserEntity>;
}
