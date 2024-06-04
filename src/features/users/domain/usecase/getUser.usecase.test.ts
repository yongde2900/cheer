import { UserRepository } from '../repositories/user.repository';
import { GetUserUseCase } from './getUser.usecase';
import mock from '../tests/mock';
import { UserEntity } from '../entities/user.entity';

describe('GetUserUseCase', () => {
	let useCase: GetUserUseCase;
	let mockRepository: jest.Mocked<UserRepository>;

	beforeAll(() => {
		mockRepository = mock.createMockRepository();
		useCase = new GetUserUseCase(mockRepository);
	});

	it('should get a user', async () => {
		const user = UserEntity.fromJson({
			id: 1,
			name: 'John Doe',
			email: 'some@mail.com'
		});

		mockRepository.getById.mockResolvedValueOnce(user);

		const result = useCase.execute(1);
		expect(result).resolves.toEqual(user);
		expect(mockRepository.getById).toHaveBeenCalledWith(1);
	});

	it('should throw error if repository fail', async () => {
		const error = new Error('Repository failed');
		mockRepository.getById.mockRejectedValueOnce(error);

		await expect(useCase.execute(1)).rejects.toThrow(error);
	});
});
