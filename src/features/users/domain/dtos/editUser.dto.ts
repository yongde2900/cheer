import { IsDate, IsEmail, IsIn, IsInt, IsOptional } from 'class-validator';
import { CoreDto } from '../../../shared/domain/dtos/core.dto';
import { Sex } from '../../../shared/domain/enums';

export class EditUserDto extends CoreDto<EditUserDto> {
	@IsInt({ message: '必須為數字' })
	public readonly id: number;

	@IsOptional()
	public readonly name?: string;

	@IsOptional()
	@IsEmail()
	public readonly email?: string;

	@IsOptional()
	public readonly password?: string;

	@IsOptional()
	@IsIn(Object.values(Sex))
	public readonly sex?: number;

	@IsInt({ message: '必須為數字' })
	@IsOptional()
	public readonly age?: number;

	@IsOptional()
	@IsDate()
	public readonly birthdate?: Date;

	constructor(
		id: number,
		name?: string,
		email?: string,
		password?: string,
		sex?: number,
		age?: number,
		birthdate?: Date
	) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.sex = sex;
		this.age = age;
		this.birthdate = birthdate;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): EditUserDto {
		const { id, name, email, password, sex, age, birthdate } = obj;
		return new EditUserDto(
			id as number,
			name as string,
			email as string,
			password as string,
			sex as number,
			age as number,
			birthdate as Date
		);
	}
}
