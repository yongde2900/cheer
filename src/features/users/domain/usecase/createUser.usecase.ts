import { CreateUserDto } from '../dtos/createUser.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

export class CreateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(createDto: CreateUserDto): Promise<UserEntity> {
		createDto.password = await UserEntity.hashPassword(createDto.password);
		const user = await this.userRepository.create(createDto);
		return user;
	}
}
