import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'postgres',
	port: 5432,
	username: 'root',
	password: 'password',
	database: 'postgres',
	synchronize: true,
	logging: false,
	entities: [__dirname + '/models/**/*.model.ts'],
	subscribers: [],
	migrations: [__dirname + '/migrations/**/*.ts']
});
