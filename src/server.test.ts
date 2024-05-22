import request from 'supertest';
import { Server } from './server';
import { HttpCode } from './core/constants';
import { AppRoutes } from './routers';

describe('Server', () => {
	let server: Server;

	beforeAll(() => {
		server = new Server({
			port: 3000,
			routes: AppRoutes.routes,
			apiPrefix: '/api'
		});
		server.start();
	});

	afterAll(() => {
		server.stop();
	});

	it("should respond with 'Hello World' on GET '/api/", async () => {
		const response = await request(server['app']).get('/');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: 'Hello World' });
	});

	it('should apply rate limiting', async () => {
		for (let i = 0; i < 102; i++) {
			const response = await request(server['app']).get('/');
			if (i < 99) {
				expect(response.status).toBe(HttpCode.OK);
			} else {
				expect(response.status).toBe(HttpCode.TOO_MANY_REQUESTS);
				expect(response.text).toBe('Too many requests from this IP, please try again after an hour');
			}
		}
	});
});
