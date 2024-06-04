import { AppError } from '../../../../core';
import { EditUserDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories//user.repository';
import mock from '../tests/mock';
import { EditUserUseCase } from './editUser.usecase';
describe('EditUserUseCase', () => {
	let useCase: EditUserUseCase;
	let mockRepository: jest.Mocked<UserRepository>;
	beforeAll(() => {
		mockRepository = mock.createMockRepository();
		useCase = new EditUserUseCase(mockRepository);
	});
	it('should edit a user', async () => {
		const editDto = EditUserDto.create({
			id: 1,
			name: 'John Doe'
		});
		const editedUser = UserEntity.fromJson({
			id: 1,
			name: 'John Doe',
			email: 'test@mail.com',
			password: 'hashedPassword'
		});

		mockRepository.edit.mockResolvedValueOnce(editedUser);

		const user = await useCase.execute(editDto);
		expect(user).toEqual(editedUser);
		expect(mockRepository.edit).toHaveBeenCalledWith(editDto);
	});

	it('should throw a not found error', async () => {
		const editDto = EditUserDto.create({
			id: 1,
			name: 'John Doe'
		});
		const notFoundError = AppError.notFound('User not found');

		mockRepository.edit.mockRejectedValue(notFoundError);

		await expect(useCase.execute(editDto)).rejects.toThrow(notFoundError);
	});

	it('should throw an error if repository fail', async () => {
		const editDto = EditUserDto.create({
			id: 1,
			name: 'John Doe'
		});
		const error = new Error('Repository failed');
		mockRepository.edit.mockRejectedValue(error);

		await expect(useCase.execute(editDto)).rejects.toThrow(error);
	});
});
