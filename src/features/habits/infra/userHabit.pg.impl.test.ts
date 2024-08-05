import { DeepPartial, EntityManager } from 'typeorm';
import { UserHabitPgDataSource } from '../domain/dataSources/userHabit.pg';
import { CreateUserHabitDto, EditUserHabitDto } from '../dtos';

import { UserHabitPgDataSourceImpl } from './userHabit.pg.impl';
import { User, UserHabit } from '../../../db/postgres/models';
import { UserHabitEntity } from '../domain/entities/userHabit.entity';
import { AppError } from '../../../core';
import { Filter as GetAllUserHabitFilter, GetAllUserHabitDto } from '../dtos/getAllUserHabit.dto';
import { PaginationDto } from '../../shared/domain/dtos';

// Type representing one of the create function signatures in EntityManager.
type CreateSpy = <Entity, EntityLike extends DeepPartial<Entity>>(entity: Entity, plainObject?: EntityLike) => Entity;

const mockQueryBuilder = {
	skip: jest.fn().mockReturnThis(),
	take: jest.fn().mockReturnThis(),
	where: jest.fn().mockReturnThis(),
	andWhere: jest.fn().mockReturnThis(),
	getManyAndCount: jest.fn()
};

const createMockEntityManager = (): jest.Mocked<EntityManager> =>
	({
		findOneBy: jest.fn(),
		create: jest.fn(),
		insert: jest.fn(),
		findOne: jest.fn(),
		createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
		delete: jest.fn(),
		save: jest.fn(),
		merge: jest.fn()
	}) as unknown as jest.Mocked<EntityManager>;

describe('UserHabitPgDataSourceImpl', () => {
	let dataSource: UserHabitPgDataSource;
	let managerMock: jest.Mocked<EntityManager>;
	let userModle: User;
	let createSpy: jest.MockedFunction<CreateSpy>;
	let userHabitModel: UserHabit;
	let userHabitEntity: UserHabitEntity;

	beforeEach(() => {
		managerMock = createMockEntityManager();
		dataSource = new UserHabitPgDataSourceImpl(managerMock);
		userModle = {
			id: 1,
			name: 'test',
			email: 'mail.com',
			password: '123456',
			sex: 3,
			created_at: new Date(),
			updated_at: new Date(),
			userHabits: []
		};
		userHabitModel = {
			id: 1,
			name: 'test',
			frequency: 1,
			next_time: new Date(),
			is_active: true,
			user: userModle,
			userHabitRecords: [],
			created_at: new Date(),
			updated_at: new Date(),
			started_at: new Date()
		};
		userHabitEntity = UserHabitEntity.fromModel(userHabitModel);
	});

	describe('create', () => {
		let dto: CreateUserHabitDto;

		beforeEach(() => {
			createSpy = jest.spyOn(managerMock, 'create') as jest.MockedFunction<CreateSpy>;
			dto = new CreateUserHabitDto('Test Habit', 10, new Date(), new Date(), 1);
			userHabitModel = {
				id: 1,
				...dto,
				is_active: true,
				created_at: new Date(),
				updated_at: new Date(),
				userHabitRecords: [],
				user: userModle
			};
			userHabitEntity = UserHabitEntity.fromModel(userHabitModel);
		});
		it('should create a user Habit', async () => {
			managerMock.findOneBy.mockResolvedValueOnce(userModle);
			createSpy.mockReturnValue(userHabitModel);
			managerMock.insert.mockResolvedValueOnce({ identifiers: [{ id: 1 }], generatedMaps: [{ id: 1 }], raw: '' });

			const result = await dataSource.create(dto);

			expect(managerMock.findOneBy).toHaveBeenCalledWith(User, { id: 1 });
			expect(managerMock.create).toHaveBeenCalledWith(UserHabit, { ...dto, user: userModle });
			expect(managerMock.insert).toHaveBeenCalledWith(UserHabit, userHabitModel);
			expect(result).toEqual(userHabitEntity);
		});

		it('should throw an error if user not found', async () => {
			managerMock.findOneBy.mockResolvedValueOnce(null);
			const error = AppError.notFound('User not found');
			expect(dataSource.create(dto)).rejects.toThrow(error);
			expect(managerMock.findOneBy).toHaveBeenCalledWith(User, { id: 1 });
		});
	});

	describe('getById', () => {
		it('should get a user habit by id', async () => {
			managerMock.findOneBy.mockResolvedValueOnce(userHabitModel);

			const result = await dataSource.getById(1);

			expect(result).toEqual(userHabitEntity);
			expect(managerMock.findOneBy).toHaveBeenCalledWith(UserHabit, { id: 1 });
		});

		it('should return null if user habit not found', async () => {
			managerMock.findOneBy.mockResolvedValueOnce(null);

			const result = await dataSource.getById(1);

			expect(result).toBeNull();
			expect(managerMock.findOneBy).toHaveBeenCalledWith(UserHabit, { id: 1 });
		});
	});

	describe('getAll', () => {
		it('should get all user with default pagination', async () => {
			const dto = new GetAllUserHabitDto(new PaginationDto(1, 10), new GetAllUserHabitFilter(1));
			const userHabits: UserHabit[] = [userHabitModel];
			mockQueryBuilder.getManyAndCount.mockReturnValueOnce([userHabits, 1]);

			const result = await dataSource.getAll(dto);

			expect(managerMock.createQueryBuilder).toHaveBeenCalledWith(UserHabit, 'userHabit');
			expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
			expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
			expect(mockQueryBuilder.where).toHaveBeenCalledWith('userHabit.user_id = :userId', { userId: 1 });
			expect(result.data).toEqual(userHabits.map(UserHabitEntity.fromModel));
			expect(result.total).toBe(1);
		});

		it('should get user habits with name filter', async () => {
			const dto = new GetAllUserHabitDto(new PaginationDto(1, 10), new GetAllUserHabitFilter(1, 'test'));
			const userHabits: UserHabit[] = [userHabitModel];
			mockQueryBuilder.getManyAndCount.mockReturnValueOnce([userHabits, 1]);

			const result = await dataSource.getAll(dto);

			expect(managerMock.createQueryBuilder).toHaveBeenCalledWith(UserHabit, 'userHabit');
			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('userHabit.name = :name', { name: 'test' });
			expect(result.data).toEqual(userHabits.map(UserHabitEntity.fromModel));
			expect(result.total).toBe(1);
		});

		it('should get user habits with frequency filter', async () => {
			const dto = new GetAllUserHabitDto(new PaginationDto(1, 10), new GetAllUserHabitFilter(1, undefined, 1));
			const userHabits: UserHabit[] = [userHabitModel];
			mockQueryBuilder.getManyAndCount.mockReturnValueOnce([userHabits, 1]);

			const result = await dataSource.getAll(dto);

			expect(managerMock.createQueryBuilder).toHaveBeenCalledWith(UserHabit, 'userHabit');
			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('userHabit.frequency & :frequency = :frequency', {
				frequency: 1
			});
			expect(result.data).toEqual(userHabits.map(UserHabitEntity.fromModel));
			expect(result.total).toBe(1);
		});

		it('should get user habits with nextTime filter', async () => {
			const nextTime = new Date();
			const dto = new GetAllUserHabitDto(
				new PaginationDto(1, 10),
				new GetAllUserHabitFilter(1, undefined, undefined, undefined, nextTime)
			);
			const userHabits: UserHabit[] = [userHabitModel];

			mockQueryBuilder.getManyAndCount.mockReturnValueOnce([userHabits, 1]);

			const result = await dataSource.getAll(dto);

			expect(managerMock.createQueryBuilder).toHaveBeenCalledWith(UserHabit, 'userHabit');
			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('userHabit.nextTime = :nextTime', { nextTime });
			expect(result.data).toEqual(userHabits.map(UserHabitEntity.fromModel));
			expect(result.total).toBe(1);
		});

		it('should get user habits with isActive filter', async () => {
			const dto = new GetAllUserHabitDto(
				new PaginationDto(1, 10),
				new GetAllUserHabitFilter(1, undefined, undefined, true)
			);
			const userHabits: UserHabit[] = [userHabitModel];

			mockQueryBuilder.getManyAndCount.mockReturnValueOnce([userHabits, 1]);

			const result = await dataSource.getAll(dto);

			expect(managerMock.createQueryBuilder).toHaveBeenCalledWith(UserHabit, 'userHabit');
			expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('userHabit.isActive = :isActive', { isActive: true });
			expect(result.data).toEqual(userHabits.map(UserHabitEntity.fromModel));
			expect(result.total).toBe(1);
		});
	});

	describe('delete', () => {
		it('should delete a user habit', async () => {
			managerMock.findOne.mockResolvedValueOnce(userHabitModel);

			await dataSource.delete(1, 1);

			expect(managerMock.findOne).toHaveBeenCalledWith(UserHabit, { where: { id: 1, 'user.id': 1 } });
			expect(managerMock.delete).toHaveBeenCalledWith(UserHabit, 1);
		});

		it('should throw an error if user habit not found', async () => {
			managerMock.findOne.mockResolvedValueOnce(null);
			const error = AppError.notFound('UserHabit not found');
			expect(dataSource.delete(1, 1)).rejects.toThrow(error);
			expect(managerMock.findOne).toHaveBeenCalledWith(UserHabit, { where: { id: 1, 'user.id': 1 } });
		});
	});

	describe('edit', () => {
		let dto = EditUserHabitDto.create({
			id: 1,
			userId: 1,
			name: 'test',
			frequency: 1,
			isActive: true
		});
		it('should edit a user habit', async () => {
			managerMock.findOne.mockResolvedValueOnce(userHabitModel);
			managerMock.merge.mockReturnValueOnce(userHabitModel);

			const result = await dataSource.edit(dto);

			expect(managerMock.findOne).toHaveBeenCalledWith(UserHabit, { where: { id: 1, 'user.id': 1 } });
			expect(managerMock.merge).toHaveBeenCalledWith(UserHabit, userHabitModel, { ...dto, is_active: dto.isActive });
			expect(result).toEqual(userHabitEntity);
		});

		it('should throw an error if user habit not found', async () => {
			managerMock.findOne.mockResolvedValueOnce(null);

			const error = AppError.notFound('UserHabit not found');

			expect(dataSource.edit(dto)).rejects.toThrow(error);
			expect(managerMock.findOne).toHaveBeenCalledWith(UserHabit, { where: { id: 1, 'user.id': 1 } });
		});
	});
});
