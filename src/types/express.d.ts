declare global {
	namespace Express {
		interface Request {
			userInfo?: JwtPayload;
		}
	}
}

interface JwtPayload {
	id: string;
}

export {};
