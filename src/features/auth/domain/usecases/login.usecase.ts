import { AppError } from '../../../../core';
import { generateToken } from '../../../../utils/generateToken';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserRepository } from '../../../users/domain/repositories/user.repository';

export class LoginUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(email: string, password: string): Promise<string> {
		const user = await this.userRepository.getByEmail(email);
		if (!user) {
			throw AppError.notFound('User not found');
		}

		const isPasswordCorrect = await UserEntity.comparePassword(user.password, password);

		if (!isPasswordCorrect) {
			throw AppError.unauthorized('Invalid password');
		}

		return generateToken(user.id);
	}
}
