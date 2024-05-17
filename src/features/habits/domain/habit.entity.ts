import { IsInt, IsString, Max } from 'class-validator';
import { BaseEntity } from '../../shared/domain/entities/BaseEntity';

export default class HabitEntity extends BaseEntity {
	@IsInt({ message: '必須為數字' })
	@Max(100, { message: '不得大於100' })
	public id: number;

	@IsString()
	public name: string;

	@IsString()
	public description: string;

	constructor(id: number, name: string, description: string) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
	}

	public static async fromJson(obj: Record<string, unknown>): Promise<HabitEntity> {
		return super.baseFromJson<HabitEntity>(obj);
	}
}

