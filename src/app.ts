import { envs } from './core/config/env';
import { AppDataSource } from './db/postgres/data-source';
import redis from './db/redis/redis';
import { AppRoutes } from './routers';
import { Server } from './server';
import 'reflect-metadata';

(() => {
	main();
})();

export default function main(): void {
	// 資料庫連接
	const pgDataSource = AppDataSource;

	// redis 連接
	const redisDataSource = redis;

	const server = new Server({
		routes: AppRoutes.routes(pgDataSource, redisDataSource),
		port: envs.PORT,
		apiPrefix: envs.API_PREFIX,
		pgDataSource,
		redisDataSource
	});
	server.start();
}
