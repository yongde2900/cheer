import { CreateUserDto } from '../dtos/createUser.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserUseCase } from './createUser.usecase';

describe('UseCase: CreateUser', () => {
	let repository: jest.Mocked<UserRepository>;
	let createUserUseCase: CreateUserUseCase;
	let createUserDto: CreateUserDto;

	beforeEach(() => {
		repository = {
			create: jest.fn(),
			delete: jest.fn(),
			getById: jest.fn(),
			getAll: jest.fn(),
			getByEmail: jest.fn(),
			editUser: jest.fn()
		} as jest.Mocked<UserRepository>;

		createUserUseCase = new CreateUserUseCase(repository);
		createUserDto = {
			name: 'John Doe',
			email: 'mail@mail.com',
			password: 'password'
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create a user', async () => {
		const userEntity: UserEntity = UserEntity.fromJson({
			id: 1,
			name: 'John Doe',
			email: 'mail@mail.com',
			password: 'hashedPassword'
		});

		jest.spyOn(UserEntity, 'hashPassword').mockResolvedValue('hashedPassword');

		repository.create.mockResolvedValue(userEntity);

		const result = await createUserUseCase.execute(createUserDto);

		expect(repository.create).toHaveBeenCalledWith(createUserDto);
		expect(UserEntity.hashPassword).toHaveBeenCalledWith('password');
		expect(result).toEqual(userEntity);
	});

	it('should throw an error if the repository.create fails', async () => {
		const err = new Error('Error creating user');
		repository.create.mockRejectedValue(err);

		expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(err);
	});
});
