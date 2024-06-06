import { UserRepository } from '../repositories/repository';

export class GetUserUseCase {
	constructor(private readonly repository: UserRepository) {}

	execute(id: number) {
		return this.repository.getById(id);
	}
}
