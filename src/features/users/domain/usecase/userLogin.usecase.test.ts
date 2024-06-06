import { UserLoginDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/repository';
import mock from '../tests/mock';
import { UserLoginUseCase } from './userLogin.usecase';

describe('UseCase: UserLogin', () => {
	let repository: jest.Mocked<UserRepository>;
	let userLoginUseCase: UserLoginUseCase;
	let userLoginDto: UserLoginDto;
	let userEntity: UserEntity;

	beforeEach(() => {
		repository = mock.createMockRepository();

		userLoginUseCase = new UserLoginUseCase(repository);
		const data = {
			email: 'mail@mail.com',
			password: 'password'
		};
		userLoginDto = new UserLoginDto(data.email, data.password);
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
    const wrongPasswordDto = new UserLoginDto(userLoginDto.email, 'wrongPassword');

		expect(userLoginUseCase.execute(wrongPasswordDto)).rejects.toThrow('Invalid password');
		expect(repository.getByEmail).toHaveBeenCalledWith(userLoginDto.email);
	});
});
