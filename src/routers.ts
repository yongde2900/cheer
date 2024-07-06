import { Router } from 'express';
import { HabitRoutes } from './features/habits/presentation/routes';
import { DataSource } from 'typeorm';
import { UserRoutes } from './features/users/presentation/routes';
import { Redis } from 'ioredis';

export class AppRoutes {
	static routes(dataSource: DataSource, redis: Redis) {
		const router = Router();

		router.use('/habits', HabitRoutes.routes);
		router.use('/users', UserRoutes.routes(dataSource, redis));

		return router;
	}
}
