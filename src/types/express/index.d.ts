import express from 'express';
import { JwtPayload } from '../../features/shared/presentation/middlewares/auth.middleware';

declare global {
	namespace Express {
		interface Request {
			userInfo?: JwtPayload;
		}
	}
}
export {};
