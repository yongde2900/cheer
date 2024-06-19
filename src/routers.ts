import { Router } from 'express';
import { HabitRoutes } from './features/habits/presentation/routes';
import { DataSource } from 'typeorm';
import { UserRoutes } from './features/users/presentation/routes';

export class AppRoutes {
	static routes(dataSource: DataSource) {
		const router = Router();

		router.use('/habits', HabitRoutes.routes);
		router.use('/users', UserRoutes.routes(dataSource));

		return router;
	}
}
