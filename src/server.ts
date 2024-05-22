import express, { Router, type Request, type Response } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import http from 'http';

import { HttpCode } from './core/constants';
import { ErrorMiddleware } from './features/shared/presentation/middlewares/error.middleware';

interface ServerOptions {
	port: number;
	routes: Router;
	apiPrefix: string;
}

export class Server {
	private readonly app = express();
	private server!: http.Server;
	private readonly port: number;
	private readonly routes: Router;
	private readonly apiPrefix: string;

	constructor(options: ServerOptions) {
		const { port, routes, apiPrefix } = options;
		this.port = port;
		this.routes = routes;
		this.apiPrefix = apiPrefix;
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

		//cors

		// Routes
		this.app.use(this.apiPrefix, this.routes);

		// Test rest api
		this.app.get(`/`, (_req: Request, res: Response) => {
			return res.status(HttpCode.OK).send({
				message: 'Hello World'
			});
		});

		// Error Middleware
		this.routes.use(ErrorMiddleware.handelError);

		this.server = this.app.listen(this.port, () => {
			console.log(`Server  running on Port: ${this.port}`);
		});
	}

	async stop() { if (this.server) this.server.close();
	}
}
