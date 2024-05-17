import { HttpCode } from '../constants';

export interface ValidationType {
	field: string;
	constraint: string;
}

export class ValidationError extends Error {
	public readonly statusCode: number;
	public readonly validationErrors: ValidationType[];

	constructor(validationErrors: ValidationType[]) {
		super('Validation Error');
		// 使用class extends Error時，可能會出現問題，所以需要手動設定原型鏈
		Object.setPrototypeOf(this, new.target.prototype);
		this.statusCode = HttpCode.BAD_REQUEST;
		this.validationErrors = validationErrors;
		Error.captureStackTrace(this);
	}
}
