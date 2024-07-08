import express, { Router, type Request, type Response } from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import http from 'http';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import specs from './swaggerConfig';

import { HttpCode } from './core/constants';
import { ErrorMiddleware } from './features/shared/presentation/middlewares/error.middleware';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';

interface ServerOptions {
	port: number;
	routes: Router;
	apiPrefix: string;
	pqDataSource: DataSource;
	redisDataSource: Redis;
}

export class Server {
	private readonly app = express();
	private server!: http.Server;
	private readonly port: number;
	private readonly routes: Router;
	private readonly apiPrefix: string;
	private readonly pq: DataSource;
	private readonly redis: Redis;

	constructor(options: ServerOptions) {
		const { port, routes, apiPrefix, pqDataSource, redisDataSource } = options;
		this.port = port;
		this.routes = routes;
		this.apiPrefix = apiPrefix;
		this.pq = pqDataSource;
		this.redis = redisDataSource;
	}

	async start() {
		//db init
		try {
			this.pq.initialize();
		} catch (err) {
			console.log(err);
		}

		// 信任一層代理 也就是nginx 取得用戶真實ip
		this.app.set('trust proxy', 1);

		//rate limit
		this.app.use(
			rateLimit({
				max: 100,
				windowMs: 60 * 60 * 1000,
				message: 'Too many requests from this IP, please try again after an hour'
			})
		);

		// Middleware
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(compression());

		//cors
		this.app.use(cors());

		// Routes
		this.app.use(this.apiPrefix, this.routes);
		console.log(this.apiPrefix);

		// Test rest api
		this.app.get(`/`, (_req: Request, res: Response) => {
			return res.status(HttpCode.OK).send({
				message: 'Hello World'
			});
		});

		// Error Middleware
		this.routes.use(ErrorMiddleware.handelError);

		//swagger
		this.app.use(
			'/api-docs',
			swaggerUi.serve,
			swaggerUi.setup(specs, { swaggerOptions: { persistAuthorization: true } })
		);

		this.server = this.app.listen(this.port, () => {
			console.log(`Server  running on Port: ${this.port}`);
		});
	}

	async stop() {
		if (this.server) this.server.close();
		if (this.pq) await this.pq.destroy();
		if (this.redis) this.redis.disconnect();
	}
}
