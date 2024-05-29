import { UserLoginDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserLoginUseCase } from './userLogin.usecase';

describe('UseCase: UserLogin', () => {
	let repository: jest.Mocked<UserRepository>;
	let userLoginUseCase: UserLoginUseCase;
	let userLoginDto: UserLoginDto;
	let userEntity: UserEntity;

	beforeEach(() => {
		repository = {
			create: jest.fn(),
			delete: jest.fn(),
			getById: jest.fn(),
			getAll: jest.fn(),
			getByEmail: jest.fn(),
			editUser: jest.fn()
		} as jest.Mocked<UserRepository>;

		userLoginUseCase = new UserLoginUseCase(repository);
		userLoginDto = {
			email: 'mail@mail.com',
			password: 'password'
		};
		userEntity = UserEntity.fromJson({
			id: 1,
			name: 'John Doe',
			email: 'mail@mail.com',
			password: 'hashedPassword'
		});

		jest.spyOn(userEntity, 'comparePassword').mockImplementation(async (password: string) => {
			return password === 'password';
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('shold login a user', async () => {
		repository.getByEmail.mockResolvedValue(userEntity);
		const result = await userLoginUseCase.execute(userLoginDto);

		expect(repository.getByEmail).toHaveBeenCalledWith(userLoginDto.email);
		expect(result).toEqual(userEntity);
	});

	it('shold throw not found error if user does not exist', async () => {
		repository.getByEmail.mockResolvedValue(null);
		expect(userLoginUseCase.execute(userLoginDto)).rejects.toThrow('User not found');
	});

	it('shold throw unauthorized error if password is incorrect', async () => {
		repository.getByEmail.mockResolvedValue(userEntity);
		userLoginDto.password = 'wrongPassword';

		expect(userLoginUseCase.execute(userLoginDto)).rejects.toThrow('Invalid password');
		expect(repository.getByEmail).toHaveBeenCalledWith(userLoginDto.email);
	});
});
