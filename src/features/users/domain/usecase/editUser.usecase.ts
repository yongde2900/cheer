import { EditUserDto } from '../dtos/editUser.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

export class EditUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(editDto: EditUserDto): Promise<UserEntity> {
		const user = await this.userRepository.edit(editDto);
		return user;
	}
}
