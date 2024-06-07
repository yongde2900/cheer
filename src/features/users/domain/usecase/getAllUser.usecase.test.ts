import { GetAllUserDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/repository';
import mock from '../tests/mock';
import { GetAllUserUseCase } from './getAllUser.usecase';

describe('GetAllUserUseCase', () => {
	let useCase: GetAllUserUseCase;
	let mockRepository: jest.Mocked<UserRepository>;

	beforeAll(() => {
		mockRepository = mock.createMockRepository();
		useCase = new GetAllUserUseCase(mockRepository);
	});

	it('should get all users', async () => {
		const users = [
			{
				id: 1,
				name: 'John Doe',
				email: 'some@some.mail'
			},
			{
				id: 2,
				name: 'Jane Doe',
				email: 'mail@mail.com'
			}
		].map((user) => UserEntity.fromJson(user));
		mockRepository.getAll.mockResolvedValueOnce({ data: users, total: 2 });
		const getAllUserDto = GetAllUserDto.create({ page: 1, limit: 10 });
		const result = await useCase.execute(getAllUserDto);

		expect(result).toEqual({ data: users, total: 2 });
		expect(mockRepository.getAll).toHaveBeenCalledWith(getAllUserDto);
	});

	it('should throw error if repository fail', async () => {
		const error = new Error('Repository failed');
		mockRepository.getAll.mockRejectedValueOnce(error);

		const getAllUserDto = GetAllUserDto.create({ page: 1, limit: 10 });
    await expect(useCase.execute(getAllUserDto)).rejects.toThrow(error);

	});
});
