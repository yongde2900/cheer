import { BaseEntity } from '../../../shared/domain/entities/BaseEntity';
import { compare, hash } from 'bcryptjs';

export class UserEntity extends BaseEntity {
	public id: number;

	public name: string;

	public email: string;

	public password: string;

	public sex?: number;

	public age?: number;

	public birthday?: Date;

	constructor(id: number, name: string, email: string, password: string, sex?: number, age?: number, birthday?: Date) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.sex = sex || undefined;
		this.age = age || undefined;
		this.birthday = birthday || undefined;
	}

	public static fromJson(obj: Record<string, unknown>): UserEntity {
		return super.baseFromJson<UserEntity>(obj);
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
}
