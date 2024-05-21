import { Router } from 'express';
import { HabitRoutes } from './features/habits/presentation/routes';

export class AppRoutes {
	static get routes() {
		const router = Router();

		router.use('/habits', HabitRoutes.routes);

		return router;
	}
}
