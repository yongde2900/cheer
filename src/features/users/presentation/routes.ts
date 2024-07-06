import { DataSource } from 'typeorm';
import { Router } from 'express';
import { User } from '../../../db/postgres/models';
import { PqUserDataSourceImpl, UserRepositoryImpl, RedisUserDataSourceImpl } from '../infra';
import { UserController } from './controller';
import { Redis } from 'ioredis';

export class UserRoutes {
	static routes(pq: DataSource, redis: Redis): Router {
		const router = Router();
		const pqUserRepository = pq.getRepository(User);
		const redisUserRepository = new RedisUserDataSourceImpl(redis);

		const dataSource = new PqUserDataSourceImpl(pqUserRepository);
		const repository = new UserRepositoryImpl(dataSource, redisUserRepository);
		const controller = new UserController(repository);

		router.get('/', controller.getAll);
		router.get('/:id', controller.get);
		router.post('/', controller.create);
		router.put('/:id', controller.edit);
		router.post('/login', controller.login);

		return router;
	}
}
