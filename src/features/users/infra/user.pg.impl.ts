import { Repository } from 'typeorm';
import { CreateUserDto, UserEntity, EditUserDto, GetAllUserDto } from '../domain';
import { UserPgDataSource } from '../domain/dataSource/user.pg';
import { User } from '../../../db/postgres/models';
import { AppError } from '../../../core';

export class UserPgDataSourceImpl implements UserPgDataSource {
	constructor(private readonly userRepository: Repository<User>) {}

	async create(createDto: CreateUserDto): Promise<UserEntity> {
		let user = this.userRepository.create(createDto);
		user = await this.userRepository.save(user);

		const userEntity = UserEntity.fromModel(user);

		return userEntity;
	}

	async getById(id: number): Promise<UserEntity | null> {
		const user = await this.userRepository.findOneBy({ id });

		if (user) return UserEntity.fromModel(user);

		return null;
	}

	async getAll(getAllDto: GetAllUserDto): Promise<{ data: UserEntity[]; total: number }> {
		const { filter, pagination } = getAllDto;
		const pageSize = pagination.limit;
		const skip = (pagination.page - 1) * pageSize;

		const query = this.userRepository.createQueryBuilder('user').skip(skip).take(pageSize);
		//filter
		if (filter.name) {
			query.andWhere('user.name LIKE :name', { name: `%${filter.name}%` });
		}
		if (filter.email) {
			query.andWhere('user.email LIKE :email', { email: `%${filter.email}%` });
		}

		const [data, total] = await query.getManyAndCount();

		const users = data.map((user) => UserEntity.fromModel(user));

		return { data: users, total };
	}

	async getByEmail(email: string): Promise<UserEntity | null> {
		const user = await this.userRepository.findOneBy({ email });
		if (user) return UserEntity.fromModel(user);
		return null;
	}

	async edit(editDto: EditUserDto): Promise<UserEntity> {
		const user = await this.userRepository.findOneBy({ id: editDto.id });
		if (!user) {
			throw AppError.notFound('User not found');
		}
		this.userRepository.merge(user, editDto);
		await this.userRepository.save(user);

		const userEntity = UserEntity.fromModel(user);
		return userEntity;
	}

	async delete(id: number): Promise<void> {
		this.userRepository.delete(id);
	}
}
