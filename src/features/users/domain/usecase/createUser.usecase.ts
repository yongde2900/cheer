import { CreateUserDto } from '../dtos/createUser.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/repository';

export class CreateUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(createDto: CreateUserDto): Promise<UserEntity> {
		const hashPassword = await UserEntity.hashPassword(createDto.password);
		const hashedDto = CreateUserDto.create({ ...createDto, password: hashPassword });
		const user = await this.userRepository.create(hashedDto);
		return user;
	}
}
