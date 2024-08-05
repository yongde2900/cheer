import { UserHabit } from '../../../../db/postgres/models';
import { BaseEntity } from '../../../shared/domain/entities/BaseEntity';

export interface UserHabitDTO {}

export class UserHabitEntity extends BaseEntity {
	public id: number;

	public name: string;

	public frequency: number;

	public startedAt: Date;

	public isActive: boolean;

	public nextTime: Date;

	public createdAt: Date;

	public updatedAt: Date;

	constructor(
		id: number,
		name: string,
		frequency: number,
		startedAt: Date,
		isActive: boolean,
		nextTime: Date,
		createdAt: Date,
		updatedAt: Date
	) {
		super();
		this.id = id;
		this.name = name;
		this.frequency = frequency;
		this.startedAt = startedAt;
		this.isActive = isActive;
		this.nextTime = nextTime;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static fromJson(obj: Record<string, unknown>): UserHabitEntity {
		return super.baseFromJson<UserHabitEntity>(obj);
	}

	public static fromModel(model: UserHabit): UserHabitEntity {
		return UserHabitEntity.fromJson({
			id: model.id,
			name: model.name,
			frequency: model.frequency,
			startedAt: model.started_at,
			isActive: model.is_active,
			nextTime: model.next_time,
			createdAt: model.created_at,
			updatedAt: model.updated_at
		});
	}
}
