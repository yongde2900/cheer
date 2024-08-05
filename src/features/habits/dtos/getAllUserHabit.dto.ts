import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { CoreDto, PaginationDto } from '../../shared/domain/dtos';

export class Filter {
	@IsOptional()
	@IsString()
	public readonly name?: string;

	@IsOptional()
	@Max(127)
	@Min(0)
	public readonly frequency?: number;

	@IsOptional()
	@IsBoolean()
	public readonly isActive?: boolean;

	@IsOptional()
	@IsDate()
	public readonly nextTime?: Date;

	@IsNumber()
	public readonly userId: number;

	constructor(userId: number, name?: string, frequency?: number, isActive?: boolean, nextTime?: Date) {
		this.name = name;
		this.frequency = frequency;
		this.isActive = isActive;
		this.nextTime = nextTime;
		this.userId = userId;
	}
}

export class GetAllUserHabitDto extends CoreDto<GetAllUserHabitDto> {
	public readonly pagination: PaginationDto;

	@ValidateNested()
	public readonly filter: Filter;

	constructor(pagination: PaginationDto, filter: Filter) {
		super();
		this.pagination = pagination;
		this.filter = filter;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): GetAllUserHabitDto {
		const { name, frequency, isActive, nextTime, userId } = obj;
		const pagination = PaginationDto.create(obj);
		const filter = new Filter(
			userId as number,
			name as string,
			frequency as number,
			isActive as boolean,
			nextTime as Date
		);
		return new GetAllUserHabitDto(pagination, filter);
	}
}
