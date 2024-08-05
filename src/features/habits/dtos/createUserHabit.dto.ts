import { IsDate, IsInt, IsString, Max, Min } from 'class-validator';
import { CoreDto } from '../../shared/domain/dtos';

export class CreateUserHabitDto extends CoreDto<CreateUserHabitDto> {
	@IsString({ message: '必須為字串' })
	public readonly name: string;

	@IsInt({ message: '必須為數字' })
	@Min(0, { message: '必須大於0' })
	@Max(127, { message: '必須小於127' })
	public readonly frequency: number;

	@IsDate({ message: '必須為日期' })
	public readonly started_at: Date;

	@IsDate({ message: '必須為日期' })
	public readonly next_time: Date;

	@IsInt({ message: '必須為數字' })
	public readonly userId: number;

	constructor(name: string, frequency: number, startedAt: Date, nextTime: Date, userId: number) {
		super();
		this.name = name;
		this.frequency = frequency;
		this.started_at = startedAt;
		this.next_time = nextTime;
		this.userId = userId;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): CreateUserHabitDto {
		const { name, frequency, startedAt, nextTime, userId } = obj;
		return new CreateUserHabitDto(
			name as string,
			frequency as number,
			startedAt as Date,
			nextTime as Date,
			userId as number
		);
	}
}
