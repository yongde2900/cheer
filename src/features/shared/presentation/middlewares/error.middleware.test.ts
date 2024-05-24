import { ErrorMiddleware } from './error.middleware';
import { ValidationError, HttpCode, AppError } from '../../../../core/';
import { NextFunction, Request, Response } from 'express';

describe('ErrorMiddleware', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: Partial<NextFunction>;
	let jsonMock: jest.Mock;
	let statusMock: jest.Mock;

	beforeEach(() => {
		req = {};
		jsonMock = jest.fn();
		statusMock = jest.fn().mockReturnValue({ json: jsonMock });
		res = {
			status: statusMock
		};
		next = jest.fn();
	});

	it('should handle a validation error', () => {
		const error = new ValidationError([{ field: 'test', constraint: 'test' }]);
		ErrorMiddleware.handelError(error, req as Request, res as Response, next as NextFunction);
		expect(statusMock).toHaveBeenCalledWith(error.statusCode);
		expect(jsonMock).toHaveBeenCalledWith({
			name: error.name,
			message: error.message,
			validationErrors: error.validationErrors,
			stack: error.stack
		});
	});

	it('should handle an bad request error', () => {
		const error = AppError.badRequest('bad request');
		ErrorMiddleware.handelError(error, req as Request, res as Response, next as NextFunction);
		expect(statusMock).toHaveBeenCalledWith(error.statusCode);
		expect(jsonMock).toHaveBeenCalledWith({
			name: error.name,
			message: error.message,
			stack: error.stack
		});
	});

	it('should handle an unauthorized error', () => {
		const error = AppError.unauthorized('unauthorized');
		ErrorMiddleware.handelError(error, req as Request, res as Response, next as NextFunction);
		expect(statusMock).toHaveBeenCalledWith(error.statusCode);
		expect(jsonMock).toHaveBeenCalledWith({
			name: error.name,
			message: error.message,
			stack: error.stack
		});
	});

	it('should handle an forbidden error', () => {
		const error = AppError.forbidden('forbidden');
		ErrorMiddleware.handelError(error, req as Request, res as Response, next as NextFunction);
		expect(statusMock).toHaveBeenCalledWith(error.statusCode);
		expect(jsonMock).toHaveBeenCalledWith({
			name: error.name,
			message: error.message,
			stack: error.stack
		});
	});

	it('should handle an not found error', () => {
		const error = AppError.notFound('not found');
		ErrorMiddleware.handelError(error, req as Request, res as Response, next as NextFunction);
		expect(statusMock).toHaveBeenCalledWith(error.statusCode);
		expect(jsonMock).toHaveBeenCalledWith({
			name: error.name,
			message: error.message,
			stack: error.stack
		});
	});

	it('should handle an internal server error', () => {
		const error = AppError.internalServer('internal server error');
		ErrorMiddleware.handelError(error, req as Request, res as Response, next as NextFunction);
		expect(statusMock).toHaveBeenCalledWith(error.statusCode);
		expect(jsonMock).toHaveBeenCalledWith({
			name: error.name,
			message: error.message,
			stack: error.stack
		});
	});

	it('should handle an unknown error', () => {
		const error = new Error();
		ErrorMiddleware.handelError(error, req as Request, res as Response, next as NextFunction);
		expect(statusMock).toHaveBeenCalledWith(HttpCode.INTERNAL_SERVER_ERROR);
		expect(jsonMock).toHaveBeenCalledWith({
			name: 'Internal Server Error',
			message: 'An internal server error occurred'
		});
	});
});
