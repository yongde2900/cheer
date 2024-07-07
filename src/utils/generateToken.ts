import jwt from 'jsonwebtoken';
import { envs } from '../core';
export const generateToken = (id: number, name: string): string => {
	return jwt.sign({ id,name }, envs.JWT_SECRET, { expiresIn: '7day' });
};
