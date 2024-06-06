import { GetAllUserDto } from '../dtos/getAllUser.dto';
import { UserRepository } from '../repositories/repository';

export class GetAllUserUseCase {
	constructor(private readonly repository: UserRepository) {}
	execute(dto: GetAllUserDto) {
		return this.repository.getAll(dto);
	}
}
