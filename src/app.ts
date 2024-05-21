import { envs } from './core/config/env';
import { AppRoutes } from './routers';
import { Server } from './server';
import 'reflect-metadata';

(() => {
	main();
})();

export default function main(): void {
	const server = new Server({
		routes: AppRoutes.routes,
		port: envs.PORT,
		apiPrefix: envs.API_PREFIX
	});
	server.start();
}
