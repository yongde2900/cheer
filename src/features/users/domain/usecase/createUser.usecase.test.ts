import { CreateUserDto } from '../dtos/createUser.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/repository';
import mock from '../tests/mock';
import { CreateUserUseCase } from './createUser.usecase';

describe('UseCase: CreateUser', () => {
	let repository: jest.Mocked<UserRepository>;
	let createUserUseCase: CreateUserUseCase;
	let createUserDto: CreateUserDto;
	let hashDto: CreateUserDto;

	beforeEach(() => {
		repository = mock.createMockRepository();

		createUserUseCase = new CreateUserUseCase(repository);
		createUserDto = CreateUserDto.create({
			name: 'John Doe',
			email: 'mail@mail.com',
			password: 'password'
		});

		hashDto = CreateUserDto.create({
			name: 'John Doe',
			email: 'mail@mail.com',
			password: 'hashedPassword'
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create a user', async () => {
		const userEntity: UserEntity = UserEntity.fromJson({
			id: 1,
			name: hashDto.name,
			email: hashDto.email,
			password: hashDto.password
		});

		jest.spyOn(UserEntity, 'hashPassword').mockResolvedValue(hashDto.password);

		repository.create.mockResolvedValue(userEntity);

		const result = await createUserUseCase.execute(createUserDto);

		expect(repository.create).toHaveBeenCalledWith(hashDto);
		expect(UserEntity.hashPassword).toHaveBeenCalledWith(createUserDto.password);
		expect(result).toEqual(userEntity);
	});

	it('should throw an error if the repository.create fails', async () => {
		const err = new Error('Error creating user');
		repository.create.mockRejectedValue(err);

		expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(err);
	});
});
