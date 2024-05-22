import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ValidationError, ValidationType } from '../../../../core';

export class BaseEntity {
	constructor() {}

	public static baseFromJson<T extends BaseEntity>(obj: Record<string, unknown>): T {
		const instance = plainToInstance(this, obj) as T;
		BaseEntity.validate(instance);
		return instance;
	}

	public static validate<T extends BaseEntity>(instance: T): void {
		const errors = validateSync(instance);
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
	}
}
