import { AppError } from '../../../../core';
import { UserLoginDto } from '../dtos';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/repository';

export class UserLoginUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(userLoginDto: UserLoginDto): Promise<UserEntity> {
		const user = await this.userRepository.getByEmail(userLoginDto.email);
		if (!user) {
			throw AppError.notFound('User not found');
		}
		const isPasswordCorrect = await user.comparePassword(userLoginDto.password);
		if (!isPasswordCorrect) {
			throw AppError.unauthorized('Invalid password');
		}
		return user;
	}
}
