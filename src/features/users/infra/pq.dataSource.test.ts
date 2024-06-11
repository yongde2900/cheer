import { CreateUserDto, EditUserDto, GetAllUserDto, UserEntity } from '../domain';
import { PqUserDataSource } from '../domain/dataSource/pq.dataSource';
import { PqUserDataSourceImpl } from './pq.dataSource.impl';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../../../db/postgres/models';
import { AppError } from '../../../core';

describe('PqDataSourceImpl', () => {
	let dataSource: PqUserDataSource;
	let mockUserRepository: jest.Mocked<Repository<User>>;
	let mockSelectQueryBuilder: jest.Mocked<SelectQueryBuilder<User>>;
	let user: UserEntity;
	let userModel: User;
	beforeAll(() => {
		mockSelectQueryBuilder = {
			skip: jest.fn().mockReturnThis(),
			take: jest.fn().mockReturnThis(),
			where: jest.fn().mockReturnThis(),
			andWhere: jest.fn().mockReturnThis(),
			getManyAndCount: jest.fn()
		} as unknown as jest.Mocked<SelectQueryBuilder<User>>;

		mockUserRepository = {
			create: jest.fn(),
			save: jest.fn(),
			findOneBy: jest.fn(),
			createQueryBuilder: jest.fn().mockReturnValue(mockSelectQueryBuilder),
			delete: jest.fn(),
			merge: jest.fn()
		} as unknown as jest.Mocked<Repository<User>>;

		dataSource = new PqUserDataSourceImpl(mockUserRepository);

		user = UserEntity.fromJson({
			id: 1,
			name: 'John Doe',
			email: 'mail@mail.com',
			password: 'hashedPassword'
		});

		userModel = {
			id: 1,
			name: 'John Doe',
			email: 'mail@mail.com',
			password: 'hashedPassword'
		} as User;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('create', () => {
		let createDto: CreateUserDto;
		beforeAll(() => {
			createDto = CreateUserDto.create({
				name: 'John Doe',
				email: 'mail@mail.com',
				password: 'hashedPassword'
			});
		});

		it('should create a user', async () => {
			mockUserRepository.create.mockReturnValueOnce(userModel);
			mockUserRepository.save.mockResolvedValueOnce(userModel);

			const result = await dataSource.create(createDto);

			expect(result).toEqual(user);
			expect(mockUserRepository.create).toHaveBeenCalledWith(createDto);
			expect(mockUserRepository.save).toHaveBeenCalledWith(userModel);
		});
	});

	describe('getById', () => {
		it('should get a user by id', async () => {
			mockUserRepository.findOneBy.mockResolvedValueOnce(userModel);

			const result = await dataSource.getById(1);

			expect(result).toEqual(user);
			expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
		});

		it('should get null if user not found', async () => {
			mockUserRepository.findOneBy.mockResolvedValueOnce(null);

			const result = await dataSource.getById(1);

			expect(result).toBeNull();
			expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
		});
	});

	describe('getAll', () => {
		let getAllDto: GetAllUserDto;
		beforeAll(() => {
			getAllDto = GetAllUserDto.create({
				page: 1,
				limit: 10
			});
		});

		it('should get all users', async () => {
			mockSelectQueryBuilder.getManyAndCount.mockResolvedValueOnce([[userModel], 1]);
			const result = await dataSource.getAll(getAllDto);
			expect(result).toEqual({ data: [user], total: 1 });
			expect(mockSelectQueryBuilder.skip).toHaveBeenCalledWith(0);
			expect(mockSelectQueryBuilder.take).toHaveBeenCalledWith(10);
			expect(mockSelectQueryBuilder.where).not.toHaveBeenCalled();
		});

		it('should get all users with filter', async () => {
			mockSelectQueryBuilder.getManyAndCount.mockResolvedValueOnce([[userModel], 1]);
			getAllDto = GetAllUserDto.create({
				page: 1,
				limit: 10,
				name: 'John Doe',
				email: 'mail@mail.com'
			});
			const result = await dataSource.getAll(getAllDto);
			expect(result).toEqual({ data: [user], total: 1 });
			expect(mockSelectQueryBuilder.skip).toHaveBeenCalledWith(0);
			expect(mockSelectQueryBuilder.take).toHaveBeenCalledWith(10);
			expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('user.name LIKE :name', {
				name: `%${getAllDto.filter.name}%`
			});
			expect(mockSelectQueryBuilder.andWhere).toHaveBeenCalledWith('user.email LIKE :email', {
				email: `%${getAllDto.filter.email}%`
			});
		});
	});

	describe('getByEmail', () => {
		it('should get a user by email', async () => {
			const email = 'some@mail.com';
			mockUserRepository.findOneBy.mockResolvedValueOnce(userModel);

			const result = await dataSource.getByEmail(email);
			expect(result).toEqual(user);
			expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
		});

		it('should return null if user not found', async () => {
			const email = 'mail@mail.com';
			mockUserRepository.findOneBy.mockResolvedValueOnce(null);

			const result = await dataSource.getByEmail(email);
			expect(result).toBeNull();
			expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
		});
	});

	describe('edit', () => {
		let editDto: EditUserDto;
		beforeAll(() => {
			editDto = EditUserDto.create({
				id: 1,
				// name: 'modified name',
				email: 'modified@mail.com',
				password: 'modified password',
				sex: 2,
				age: 30,
				birthdate: new Date(2024, 5, 5)
			});
		});
		it('should edit a user', async () => {
			const modifiedUserModel = { ...userModel, ...editDto } as User;
			const modifiedUserEntity = UserEntity.fromModel(modifiedUserModel);
			mockUserRepository.findOneBy.mockResolvedValueOnce(userModel);
			mockUserRepository.save.mockResolvedValueOnce(modifiedUserModel);
      mockUserRepository.merge.mockImplementation((user,dto) => {
        Object.assign(user, dto);
        return user;
      });
			const result = await dataSource.edit(editDto);

			expect(result).toEqual(modifiedUserEntity);
			expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
			expect(mockUserRepository.save).toHaveBeenCalledWith(modifiedUserModel);
			expect(mockUserRepository.merge).toHaveBeenCalledWith(userModel, editDto);
		});

		it('should throw an error if user not found', async () => {
			mockUserRepository.findOneBy.mockResolvedValueOnce(null);
			const error = AppError.notFound('User not found');
			expect(dataSource.edit(editDto)).rejects.toThrow(error);
		});
	});

	describe('delete', () => {
		it('should delete a user', async () => {
			const id = 1;
			await dataSource.delete(id);
			expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
		});
	});
});
