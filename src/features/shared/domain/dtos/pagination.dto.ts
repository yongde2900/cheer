import { Min } from 'class-validator';
import { CoreDto } from './core.dto';

export class PaginationDto extends CoreDto<PaginationDto> {
	@Min(1)
	public readonly page: number;

	@Min(1)
	public readonly limit: number;

	private constructor(page: number, limit: number) {
		super();
		this.page = page;
		this.limit = limit;
		this.validate(this);
	}

	public static create(obj: Record<string, unknown>) {
		const { page, limit } = obj;
		return new PaginationDto(page as number, limit as number);
	}
}
