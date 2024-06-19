import { envs } from './core/config/env';
import { AppDataSource } from './db/postgres/data-source';
import { AppRoutes } from './routers';
import { Server } from './server';
import 'reflect-metadata';

(() => {
	main();
})();

export default function main(): void {
	// 資料庫連接
	const pqDataSource = AppDataSource;

	const server = new Server({
		routes: AppRoutes.routes(pqDataSource),
		port: envs.PORT,
		apiPrefix: envs.API_PREFIX,
		pqDataSource
	});
	server.start();
}
