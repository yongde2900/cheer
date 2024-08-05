import { EntityManager } from 'typeorm';
import { UserHabitEntity } from '../domain/entities/userHabit.entity';
import { CreateUserHabitDto, GetAllUserHabitDto, EditUserHabitDto } from '../dtos';
import { User, UserHabit } from '../../../db/postgres/models';
import { AppError } from '../../../core';
import { UserHabitPgDataSource } from '../domain/dataSources/userHabit.pg';
import { AppDataSource } from '../../../db/postgres/data-source';

export class UserHabitPgDataSourceImpl implements UserHabitPgDataSource {
	constructor(private manager: EntityManager) {}

	async create(dto: CreateUserHabitDto): Promise<UserHabitEntity> {
		const user = await this.manager.findOneBy(User, { id: dto.userId });
		if (!user) {
			throw AppError.badRequest('User not found');
		}
		let userHabit = this.manager.create(UserHabit, { ...dto, user: user });

		await this.manager.insert(UserHabit, userHabit);

		const userHabitEntity = UserHabitEntity.fromModel(userHabit);
		return userHabitEntity;
	}

	async getById(id: number): Promise<UserHabitEntity | null> {
		const userHabit = await this.manager.findOneBy(UserHabit, { id });

		const userHabitEntity = userHabit ? UserHabitEntity.fromModel(userHabit) : null;
		return userHabitEntity;
	}

	async getAll(dto: GetAllUserHabitDto): Promise<{ data: UserHabitEntity[]; total: number }> {
		const { filter, pagination } = dto;
		const pageSize = pagination.limit;
		const skip = (pagination.page - 1) * pageSize;

		const query = this.manager.createQueryBuilder(UserHabit, 'userHabit').skip(skip).take(pageSize);

		query.where('userHabit.user_id = :userId', { userId: filter.userId });

		if (filter.name) query.andWhere('userHabit.name = :name', { name: filter.name });
		if (filter.frequency)
			// & 運算子 用來判斷是否有該位元
			query.andWhere('userHabit.frequency & :frequency = :frequency', { frequency: filter.frequency });
		if (filter.nextTime) query.andWhere('userHabit.nextTime = :nextTime', { nextTime: filter.nextTime });
		if (filter.isActive) query.andWhere('userHabit.isActive = :isActive', { isActive: filter.isActive });

		const [data, total] = await query.getManyAndCount();

		const userHabitEntities = data.map((userHabit) => UserHabitEntity.fromModel(userHabit));
		return { data: userHabitEntities, total };
	}

	async delete(id: number, userId: number): Promise<void> {
		const where = { id: id, 'user.id': userId };
		const userHabit = await this.manager.findOne(UserHabit, { where });
		if (!userHabit) {
			throw AppError.notFound('UserHabit not found');
		}
		await this.manager.delete(UserHabit, id);
	}

	async edit(dto: EditUserHabitDto): Promise<UserHabitEntity> {
		const where = {
			id: dto.id,
			'user.id': dto.userId
		};

		const userHabit = await this.manager.findOne(UserHabit, { where });
		if (!userHabit) {
			throw AppError.notFound('UserHabit not found');
		}
		const updatedUserHabit = this.manager.merge(UserHabit, userHabit, {
			...dto,
			is_active: dto.isActive
		});
		await this.manager.save(updatedUserHabit);
		return UserHabitEntity.fromModel(updatedUserHabit);
	}
}

const pg = AppDataSource.manager;

const uerHabitPgDataSource = new UserHabitPgDataSourceImpl(pg);
// const createDto = new CreateUserHabitDto('Test Habit', 10, new Date(), new Date(), 1);
const getAllDto = GetAllUserHabitDto.create({ limit: 10, page: 1, userId: 1 });

export async function test() {
	try {
		const user = await uerHabitPgDataSource.getAll(getAllDto);
		console.log(user);
	} catch (e) {
		console.log(e);
	}
}
