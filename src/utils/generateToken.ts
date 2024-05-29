import jwt from 'jsonwebtoken';
import { envs } from '../core';
export const generateToken = (id: number): string => {
	return jwt.sign({ id }, envs.JWT_SECRET, { expiresIn: '7day' });
};
