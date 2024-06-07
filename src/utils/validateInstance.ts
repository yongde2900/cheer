import { AppError, ValidationError, ValidationType } from '../core';
import { validateSync } from 'class-validator';

export const validateInstance = <T>(instance: T): void => {
	if (!(instance instanceof Object)) {
		throw AppError.internalServer('instance is not an object');
	}
	const errors = validateSync(instance);
	if (errors.length > 0) {
		const validationErrors: ValidationType[] = errors.map((error) => {
			if (error.constraints) {
				return {
					field: error.property,
					constraint: Object.values(error.constraints).join(', ')
				};
			}

			if (error.children && error.children[0].constraints) {
				return {
					field: `${error.property}.${error.children[0].property}`,
					constraint: Object.values(error.children[0].constraints).join(', ')
				};
			}

			throw AppError.internalServer('Error constraints is undefined');
		});
		throw new ValidationError(validationErrors);
	}
};
