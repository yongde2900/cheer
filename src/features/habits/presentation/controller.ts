import { type NextFunction, type Request, type Response } from 'express';
import { type HabitRepository } from '../domain/repositories/repository';
import { HabitEntity } from '../domain/entities/habit.entity';
import { GetAllHabit } from '../domain';

export class HabitController {
	constructor(private readonly repository: HabitRepository) {}

	public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const result = await new GetAllHabit(this.repository).execute();
			res.json(result);
		} catch (err) {
			next(err);
		}
	};
}
