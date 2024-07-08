import { AppError } from '../../../core';
import { CreateUserDto, EditUserDto, GetAllUserDto, UserEntity } from '../domain';
import { UserPgDataSource } from '../domain/dataSource/user.pg';
import { UserRedisDataSource } from '../domain/dataSource/user.redis';
import { UserRepository } from '../domain/repositories/repository';
import { UserRepositoryImpl } from './repository.impl';

describe('UserRepositoryImpl', () => {
	let pgDataSource: jest.Mocked<UserPgDataSource>;
	let redisDataSource: jest.Mocked<UserRedisDataSource>;
	let repository: UserRepository;
	let user: UserEntity;

	beforeAll(() => {
		pgDataSource = {
			create: jest.fn(),
			delete: jest.fn(),
			getById: jest.fn(),
			getAll: jest.fn(),
			getByEmail: jest.fn(),
			edit: jest.fn()
		};
		redisDataSource = {
			invalidateListCache: jest.fn(),
			invalidateUserCache: jest.fn(),
			getById: jest.fn(),
			getAll: jest.fn(),
			setAll: jest.fn(),
			setUser: jest.fn(),
			unSetUser: jest.fn()
		};
		repository = new UserRepositoryImpl(pgDataSource, redisDataSource);
		user = UserEntity.fromJson({
			id: 1,
			name: 'John Doe',
			email: 'som3@mail.com',
			password: 'hashedPassword'
		});
	});
	describe('create', () => {
		let createUserDto: CreateUserDto;

		beforeAll(() => {
			createUserDto = CreateUserDto.create({
				name: 'John Doe',
				email: 'some@mail.com',
				password: 'password'
			});
		});

		it('should create a user', async () => {
			pgDataSource.create.mockResolvedValueOnce(user);

			const result = await repository.create(createUserDto);

			expect(result).toEqual(user);
			expect(pgDataSource.create).toHaveBeenCalledWith(createUserDto);
			expect(redisDataSource.invalidateListCache).toHaveBeenCalled();
		});

		it('should throw an error when user already exists', async () => {
			pgDataSource.getByEmail.mockResolvedValueOnce(user);

			expect(repository.create(createUserDto)).rejects.toThrow(AppError.badRequest('User already exists'));
		});
	});

	describe('delete', () => {
		it('should delete a user', async () => {
			await repository.delete(1);

			expect(pgDataSource.delete).toHaveBeenCalledWith(1);
			expect(redisDataSource.invalidateUserCache).toHaveBeenCalledWith(1);
		});
	});

	describe('getById', () => {
		it('should get a user by id through pgDataSource', async () => {
			redisDataSource.getById.mockResolvedValueOnce(null);
			pgDataSource.getById.mockResolvedValueOnce(user);

			const result = await repository.getById(1);

			expect(result).toEqual(user);
			expect(redisDataSource.getById).toHaveBeenCalledWith(1);
			expect(pgDataSource.getById).toHaveBeenCalledWith(1);
			expect(redisDataSource.setUser).toHaveBeenCalledWith(user);
		});

		it('should get a user by id throught redisDataSource', async () => {
			redisDataSource.getById.mockResolvedValueOnce(user);
			const result = await repository.getById(1);

			expect(result).toEqual(user);
			expect(redisDataSource.getById).toHaveBeenCalledWith(1);
			expect(pgDataSource.getById).not.toHaveBeenCalled();
		});

		it('should throw an error when user is not found', async () => {
			const error = AppError.notFound('User not found');
			expect(repository.getById(1)).rejects.toThrow(error);
		});
	});

	describe('getAll', () => {
		let getAllUserDto: GetAllUserDto;
		beforeAll(() => {
			getAllUserDto = GetAllUserDto.create({
				page: 1,
				limit: 10
			});
		});
		it('should get all users through pgDataSource', async () => {
			redisDataSource.getAll.mockResolvedValueOnce(null);
			pgDataSource.getAll.mockResolvedValueOnce({ data: [user], total: 1 });
			const result = await repository.getAll(getAllUserDto);

			expect(result).toEqual({ data: [user], total: 1 });
			expect(redisDataSource.getAll).toHaveBeenCalledWith(getAllUserDto);
			expect(pgDataSource.getAll).toHaveBeenCalled();
			expect(redisDataSource.setAll).toHaveBeenCalledWith(getAllUserDto, { data: [user], total: 1 });
		});

		it('should get all users through redisDataSource', async () => {
			redisDataSource.getAll.mockResolvedValueOnce({ data: [user], total: 1 });

			const result = await repository.getAll(getAllUserDto);
			expect(result).toEqual({ data: [user], total: 1 });
			expect(redisDataSource.getAll).toHaveBeenCalledWith(getAllUserDto);
			expect(pgDataSource.getAll).not.toHaveBeenCalled();
		});
	});

	describe('getByEmail', () => {
		it('should get a user by email', async () => {
			pgDataSource.getByEmail.mockResolvedValueOnce(user);

			const result = await repository.getByEmail(user.email);

			expect(result).toEqual(user);
		});
	});

	describe('edit', () => {
		let editDto: EditUserDto;
		beforeAll(() => {
			editDto = EditUserDto.create({
				id: 1,
				name: 'Jimmy Lin'
			});
		});
		it('should edit a user', async () => {
			pgDataSource.edit.mockResolvedValueOnce(user);

			const result = await repository.edit(editDto);

			expect(result).toEqual(user);
			expect(pgDataSource.edit).toHaveBeenCalledWith(editDto);
		});
	});
});
