import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
	apis: ['src/features/**/routes.ts'],
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Cheer API  ',
			version: '1.0.0',
			description: 'API for Cheer',
			license: {
				name: 'Licensed Under MIT',
				url: 'https://spdx.org/licenses/MIT.html'
			},
			contact: {
				name: 'Cheer Team',
				url: 'https://google.com'
			}
		},
		servers: [
			{
				url: 'http://api.localhost/v1',
				description: 'Development server'
			}
		]
	}
};

const specs = swaggerJsdoc(options);

export default specs;
