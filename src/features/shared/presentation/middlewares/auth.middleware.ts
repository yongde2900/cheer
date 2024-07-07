import { NextFunction, Request, Response } from 'express';
import { envs } from '../../../../core';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
	id: number;
	name: string;
}

export class AuthMiddleware {
	public static authenticate(req: Request, res: Response, next: NextFunction): void {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			res.status(401).json({ message: 'No token provided' });
			return;
		}
		try {
			const decode = jwt.verify(token, envs.JWT_SECRET) as JwtPayload;
			req.userInfo = decode;
			next();
		} catch (err) {
			res.status(401).json({ message: 'Unauthorized' });
		}
	}
}
