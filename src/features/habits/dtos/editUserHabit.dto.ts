import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { CoreDto } from '../../shared/domain/dtos';
import { EditUserDto } from '../../users';

export class EditUserHabitDto extends CoreDto<EditUserDto> {
	@IsNumber()
	public readonly id: number;

	@IsNumber()
	public readonly userId: number;

	@IsOptional()
	@IsString()
	public readonly name: string;

	@IsOptional()
	@Max(127)
	@Min(0)
	public readonly frequency: number;

	@IsOptional()
	@IsBoolean()
	public readonly isActive: boolean;

	constructor(id: number, userId: number, name: string, frequency: number, isActive: boolean) {
		super();
		this.id = id;
		this.userId = userId;
		this.name = name;
		this.frequency = frequency;
		this.isActive = isActive;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): EditUserHabitDto {
		const { id, userId, name, frequency, isActive } = obj;
		return new EditUserHabitDto(
			id as number,
			userId as number,
			name as string,
			frequency as number,
			isActive as boolean
		);
	}
}
