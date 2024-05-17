import { envs } from './core/config/env';
import { Server } from './server';
import 'reflect-metadata';

(() => {
	main();
})();

export default function main(): void {
	const server = new Server({
		port: envs.PORT,
		apiPrefix: envs.API_PREFIX
	});
	server.start();
}
