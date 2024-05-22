import { NextFunction, Request, Response } from 'express';
import { AppError, HttpCode,ValidationError } from '../../../../core';

export class ErrorMiddleware {
	public static handelError = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
		if (error instanceof ValidationError) {
			const { message, name, validationErrors, stack } = error;
			const statusCode = error.statusCode || HttpCode.INTERNAL_SERVER_ERROR;
			res.status(statusCode).json({ name, message, validationErrors, stack });
		} else if (error instanceof AppError) {
			const { message, name, stack } = error;
			const statusCode = error.statusCode || HttpCode.INTERNAL_SERVER_ERROR;
			res.status(statusCode).json({ name, message, stack });
		} else {
			const name = 'Internal Server Error';
			const message = 'An internal server error occurred';
			const statusCode = HttpCode.INTERNAL_SERVER_ERROR;
			res.status(statusCode).json({ name, message });
		}
	};
}
