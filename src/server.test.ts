import request from 'supertest';
import { Server } from './server';
import { HttpCode } from './core/contants';

describe('Server', () => {
	let server: Server;

	beforeAll(() => {
		server = new Server({
			port: 3000,
			apiPrefix: '/api'
		});
		server.start();
	});

	it("should respond with 'Hello World' on GET '/api/", async () => {
		const response = await request(server['app']).get('/');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: 'Hello World' });
	});

	it('should apply rate limiting', async () => {
		for (let i = 0; i < 101; i++) {
			const response = await request(server['app']).get('/');
			if (i < 100) {
				expect(response.status).toBe(HttpCode.OK);
			} else {
				expect(response.status).toBe(HttpCode.TOO_MANY_REQUESTS);
				expect(response.text).toBe('Too many requests from this IP, please try again after an hour');
			}
		}
	});
});
