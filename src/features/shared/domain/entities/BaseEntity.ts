import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError, ValidationType } from '../../../../core/errors/validation.error';

export class BaseEntity {
	constructor() {}

	public static async baseFromJson<T extends BaseEntity>(obj: Record<string, unknown>): Promise<T> {
		const instance = plainToInstance(this, obj) as T;
		const errors = await validate(instance);
		if (errors.length > 0) {
			const validationErrors: ValidationType[] = errors.map((error) => {
				if (error.constraints) {
					return {
						field: error.property,
						constraint: Object.values(error.constraints).join(', ')
					};
				}
				throw new Error('Error constraints is undefined');
			});
			throw new ValidationError(validationErrors);
		}
		return instance;
	}
}
