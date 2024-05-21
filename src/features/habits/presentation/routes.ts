import { Router } from 'express';
import { HabitDataSourceImpl } from '../infra/local.dataSource.impl';
import { HabitRepositoryImpl } from '../infra/repository.impl';
import { HabitController } from './controller';

export class HabitRoutes {
	static get routes(): Router {
		const router = Router();
		const dataSource = new HabitDataSourceImpl();
		const repository = new HabitRepositoryImpl(dataSource);
		const controller = new HabitController(repository);

		router.get('/', controller.getAll);
		return router;
	}
}
