import { IsDate, IsEmail, IsIn, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { CoreDto } from '../../../shared/domain/dtos';
import { Sex } from '../../../shared/domain/enums';

export class CreateUserDto extends CoreDto<CreateUserDto> {
	@IsString({ message: '必須為字串' })
	public readonly name: string;

	@IsEmail({}, { message: '必須為email格式' })
	public readonly email: string;

	@IsString({ message: '必須為字串' })
	@MinLength(6, { message: '最小長度為6' })
	public readonly password: string;

	@IsOptional()
	@IsIn(Object.values(Sex))
	public readonly sex?: number;

	@IsOptional()
	@IsInt({ message: '必須為數字' })
	public readonly age?: number;

	@IsOptional()
	@IsDate()
	public readonly birthdate?: Date;

	constructor(name: string, email: string, password: string, sex?: number, age?: number, birthdate?: Date) {
		super();
		this.name = name;
		this.email = email;
		this.password = password;
		this.sex = sex;
		this.age = age;
		this.birthdate = birthdate;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): CreateUserDto {
		const { name, email, password, sex, age, birthdate } = obj;
		return new CreateUserDto(
			name as string,
			email as string,
			password as string,
			sex as number,
			age as number,
			birthdate as Date
		);
	}
}
