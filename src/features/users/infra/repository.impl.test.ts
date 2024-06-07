import { AppError } from '../../../core';
import { CreateUserDto, EditUserDto, GetAllUserDto, UserEntity } from '../domain';
import { PqUserDataSource } from '../domain/dataSource/pq.dataSource';
import { RedisUserDataSource } from '../domain/dataSource/redis.dataSource';
import { UserRepository } from '../domain/repositories/repository';
import { UserRepositoryImpl } from './repository.impl';

describe('UserRepositoryImpl', () => {
	let pqDataSource: jest.Mocked<PqUserDataSource>;
	let redisDataSource: jest.Mocked<RedisUserDataSource>;
	let repository: UserRepository;
	let user: UserEntity;

	beforeAll(() => {
		pqDataSource = {
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
		repository = new UserRepositoryImpl(pqDataSource, redisDataSource);
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
			pqDataSource.create.mockResolvedValueOnce(user);

			const result = await repository.create(createUserDto);

			expect(result).toEqual(user);
			expect(pqDataSource.create).toHaveBeenCalledWith(createUserDto);
			expect(redisDataSource.invalidateListCache).toHaveBeenCalled();
		});

		it('should throw an error when user already exists', async () => {
			pqDataSource.getByEmail.mockResolvedValueOnce(user);

			expect(repository.create(createUserDto)).rejects.toThrow(AppError.badRequest('User already exists'));
		});
	});

	describe('delete', () => {
		it('should delete a user', async () => {
			await repository.delete(1);

			expect(pqDataSource.delete).toHaveBeenCalledWith(1);
			expect(redisDataSource.invalidateUserCache).toHaveBeenCalledWith(1);
		});
	});

	describe('getById', () => {
		it('should get a user by id through pqDataSource', async () => {
			redisDataSource.getById.mockResolvedValueOnce(null);
			pqDataSource.getById.mockResolvedValueOnce(user);

			const result = await repository.getById(1);

			expect(result).toEqual(user);
			expect(redisDataSource.getById).toHaveBeenCalledWith(1);
			expect(pqDataSource.getById).toHaveBeenCalledWith(1);
			expect(redisDataSource.setUser).toHaveBeenCalledWith(user);
		});

		it('should get a user by id throught redisDataSource', async () => {
			redisDataSource.getById.mockResolvedValueOnce(user);
			const result = await repository.getById(1);

			expect(result).toEqual(user);
			expect(redisDataSource.getById).toHaveBeenCalledWith(1);
			expect(pqDataSource.getById).not.toHaveBeenCalled();
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
		it('should get all users through pqDataSource', async () => {
			redisDataSource.getAll.mockResolvedValueOnce(null);
			pqDataSource.getAll.mockResolvedValueOnce([user]);
			const result = await repository.getAll(getAllUserDto);

			expect(result).toEqual([user]);
			expect(redisDataSource.getAll).toHaveBeenCalledWith(getAllUserDto);
			expect(pqDataSource.getAll).toHaveBeenCalled();
			expect(redisDataSource.setAll).toHaveBeenCalledWith(getAllUserDto, [user]);
		});

		it('should get all users through redisDataSource', async () => {
			redisDataSource.getAll.mockResolvedValueOnce([user]);

			const result = await repository.getAll(getAllUserDto);
			expect(result).toEqual([user]);
			expect(redisDataSource.getAll).toHaveBeenCalledWith(getAllUserDto);
			expect(pqDataSource.getAll).not.toHaveBeenCalled();
		});
	});

	describe('getByEmail', () => {
		it('should get a user by email', async () => {
			pqDataSource.getByEmail.mockResolvedValueOnce(user);

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
			pqDataSource.edit.mockResolvedValueOnce(user);

			const result = await repository.edit(editDto);

			expect(result).toEqual(user);
			expect(pqDataSource.edit).toHaveBeenCalledWith(editDto);
		});
	});
});
