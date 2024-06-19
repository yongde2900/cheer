import { DataSource } from 'typeorm';
import { Router } from 'express';
import { User } from '../../../db/postgres/models';
import { PqUserDataSourceImpl, UserRepositoryImpl, RedisUserDataSourceImpl } from '../infra';
import { UserController } from './controller';

export class UserRoutes {
	static routes(pq: DataSource): Router {
		const router = Router();
		const pqUserRepository = pq.getRepository(User);
		const redisUserRepository = new RedisUserDataSourceImpl();

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
