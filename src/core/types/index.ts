import { ValidationType } from '../errors';

export interface SuccessResponse<T> {
	data?: T;
}

export interface ErrorResponse {
	name: string;
	message: string;
	ValidationErrors?: ValidationType;
	stack?: string;
}
