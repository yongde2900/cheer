import { IsEmail } from 'class-validator';
import { CoreDto } from '../../../shared/domain/dtos';

export class UserLoginDto extends CoreDto<UserLoginDto> {
	@IsEmail({}, { message: '必須為email格式' })
	public readonly email: string;

	public readonly password: string;

	constructor(email: string, password: string) {
		super();
		this.email = email;
		this.password = password;
		this.validate(this);
	}
}
