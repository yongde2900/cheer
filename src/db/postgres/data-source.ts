import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'root',
	password: 'password',
	database: 'cheer',
	synchronize: true,
	logging: true,
	entities: [__dirname + '/models/**/*.model.ts'],
	subscribers: [],
	migrations: [__dirname + '/migrations/**/*.ts']
});
