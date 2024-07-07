import { IsDate, IsEmail, IsIn, IsInt, IsOptional } from 'class-validator';
import { BaseEntity } from '../../../shared/domain/entities/BaseEntity';
import { compare, hash } from 'bcryptjs';
import { Sex } from '../../../shared/domain/enums';
import { User } from '../../../../db/postgres/models';

export interface UserDTO {
	id: number;
	name: string;
	email: string;
	sex?: number;
	age?: number;
	birthdate?: Date;
}

export class UserEntity extends BaseEntity {
	public id: number;

	public name: string;

	@IsEmail()
	public email: string;

	public password: string;

	@IsOptional()
	@IsIn(Object.values(Sex))
	public sex?: number;

	@IsOptional()
	@IsInt()
	public age?: number;

	@IsOptional()
	@IsDate()
	public birthdate?: Date;

	constructor(id: number, name: string, email: string, password: string, sex?: number, age?: number, birthdate?: Date) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.sex = sex || undefined;
		this.age = age || undefined;
		this.birthdate = birthdate || undefined;
	}

	public static fromJson(obj: Record<string, unknown>): UserEntity {
		return super.baseFromJson<UserEntity>(obj);
	}

	public static fromModel(model: User): UserEntity {
		return UserEntity.fromJson({
			id: model.id,
			name: model.name,
			email: model.email,
			password: model.password,
			sex: model.sex,
			age: model.age,
			birthdate: model.birthdate
		});
	}

	public static async hashPassword(password: string): Promise<string> {
		return await hash(password, 10);
	}

	public static async comparePassword(password: string, hash: string): Promise<boolean> {
		return await compare(password, hash);
	}

	public async comparePassword(password: string): Promise<boolean> {
		return await compare(password, this.password);
	}

	public toJSON(): UserDTO {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			sex: this.sex,
			age: this.age,
			birthdate: this.birthdate
		};
	}
}
