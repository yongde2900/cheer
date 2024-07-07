import { AppError } from '../../../../core';
import { generateToken } from '../../../../utils/generateToken';
import { UserLoginDto } from '../dtos';
import { UserRepository } from '../repositories/repository';

export class UserLoginUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(userLoginDto: UserLoginDto): Promise<string> {
		const user = await this.userRepository.getByEmail(userLoginDto.email);
		if (!user) {
			throw AppError.notFound('User not found');
		}
		const isPasswordCorrect = await user.comparePassword(userLoginDto.password);
		if (!isPasswordCorrect) {
			throw AppError.unauthorized('Invalid password');
		}
		const token = generateToken(user.id, user.name);

		return token;
	}
}
