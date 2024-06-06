import { IsDate, IsEmail, IsIn, IsInt, IsOptional } from 'class-validator';
import { CoreDto } from '../../../shared/domain/dtos';
import { Sex } from '../../../shared/domain/enums';

export class CreateUserDto extends CoreDto<CreateUserDto> {
	public readonly name: string;

	@IsEmail({}, { message: '必須為email格式' })
	public readonly email: string;

	public readonly password: string;

  @IsOptional()
	@IsIn(Object.values(Sex))
	public readonly sex?: number;

  @IsOptional()
	@IsInt({ message: '必須為數字' })
	public readonly age?: number;

  @IsOptional()
	@IsDate()
	public readonly birthday?: Date;

	constructor(name: string, email: string, password: string, sex?: number, age?: number, birthday?: Date) {
		super();
		this.name = name;
		this.email = email;
		this.password = password;
		this.sex = sex;
		this.age = age;
		this.birthday = birthday;
		this.validate(this);
	}

	static create(obj: Record<string, unknown>): CreateUserDto {
		const { name, email, password, sex, age, birthday } = obj;
		return new CreateUserDto(
			name as string,
			email as string,
			password as string,
			sex as number,
			age as number,
			birthday as Date
		);
	}
}
