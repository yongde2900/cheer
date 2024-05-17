import { Server } from './server';
import main from './app';
import { envs } from './core/config/env';

jest.mock('./server');

const MockedServer = Server as jest.MockedClass<typeof Server>;

describe('Main Function', () => {
	it('should create and start the server with correct configuration', () => {
		main();

		expect(MockedServer).toHaveBeenCalledWith({
			port: envs.PORT,
			apiPrefix: envs.API_PREFIX
		});

		const instance = MockedServer.mock.instances[0];
		const mockStart = instance.start;

		expect(mockStart).toHaveBeenCalled();
	});
});
