import { NextFunction, Request, Response } from 'express';
import {
	CreateUserDto,
	CreateUserUseCase,
	EditUserDto,
	EditUserUseCase,
	GetAllUserDto,
	GetAllUserUseCase,
	GetUserUseCase,
	UserLoginDto,
	UserLoginUseCase,
	UserRepository
} from '../domain';

export class UserController {
	constructor(private readonly userRepository: UserRepository) {}

	public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const dto = CreateUserDto.create(req.body);
			const result = await new CreateUserUseCase(this.userRepository).execute(dto);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};

	public edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const id = Number(req.params.id);
			const dto = EditUserDto.create({ ...req.body, id });
			const result = await new EditUserUseCase(this.userRepository).execute(dto);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};

	public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const dto = GetAllUserDto.create(req.query);
			const result = await new GetAllUserUseCase(this.userRepository).execute(dto);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};

	public get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const id = Number(req.params.id);
			const result = await new GetUserUseCase(this.userRepository).execute(id);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};

	public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const dto = UserLoginDto.create(req.body);
			const result = await new UserLoginUseCase(this.userRepository).execute(dto);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};
}
