import { plainToInstance } from 'class-transformer';
import { validateInstance } from '../../../../utils/validateInstance';

export class BaseEntity {
	constructor() {}

	public static baseFromJson<T extends BaseEntity>(obj: Record<string, unknown>): T {
		const instance = plainToInstance(this, obj) as T;
    BaseEntity.validate(instance);
		return instance;
	}

	public static validate<T extends BaseEntity>(instance: T): void {
		validateInstance(instance);
	}
}
