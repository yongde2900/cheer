import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CoreDto, PaginationDto } from '../../../shared/domain/dtos';

class Filter {
	@IsOptional()
	@IsString()
	public readonly name?: string;

	@IsOptional()
	@IsEmail()
	public readonly email?: string;

	constructor(name: string, email: string) {
		this.name = name;
		this.email = email;
	}
}

export class GetAllUserDto extends CoreDto<GetAllUserDto> {
	public readonly pagination: PaginationDto;

	@ValidateNested()
	public readonly filter: Filter;

	constructor(pagination: PaginationDto, filter: Filter) {
		super();
		this.pagination = pagination;
		this.filter = filter;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): GetAllUserDto {
		const { name, email } = obj;
		const pagination = PaginationDto.create(obj);
		const filter = new Filter(name as string, email as string);
		return new GetAllUserDto(pagination, filter);
	}
}
