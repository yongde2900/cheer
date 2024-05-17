import express, { type Request, type Response } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { HttpCode } from './core/contants';

interface ServerOptions {
	port: number;
	apiPrefix: string;
}

export class Server {
	private readonly app = express();
	private readonly port: number;

	constructor(options: ServerOptions) {
		const { port } = options;
		this.port = port;
	}

	async start() {
		// Middleware
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(compression());
		this.app.use(
			rateLimit({
				max: 100,
				windowMs: 60 * 60 * 1000,
				message: 'Too many requests from this IP, please try again after an hour'
			})
		);

		this.app.get('/', (_req: Request, res: Response) => {
			return res.status(HttpCode.OK).send({
				message: 'Hello World'
			});
		});

		this.app.listen(this.port, () => {
			console.log(`Server  running on Port: ${this.port}`);
		});
	}
}
