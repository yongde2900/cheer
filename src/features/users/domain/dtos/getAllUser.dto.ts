import { CoreDto, PaginationDto } from '../../../shared/domain/dtos';

export class GetAllUserDto extends CoreDto<GetAllUserDto> {
	public readonly pagination: PaginationDto;
	public readonly name: string | undefined;
	public readonly email: string | undefined;

	constructor(pagination: PaginationDto, name: string, email: string) {
		super();
		this.pagination = pagination;
		this.name = name;
		this.email = email;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): GetAllUserDto {
		const { name, email } = obj;
		const pagination = PaginationDto.create(obj);
		return new GetAllUserDto(pagination, name as string, email as string);
	}
}
