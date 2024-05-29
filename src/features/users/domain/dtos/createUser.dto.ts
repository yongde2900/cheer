export interface CreateUserDto {
	name: string;
	email: string;
	password: string;
	sex?: number;
	age?: number;
	birthday?: Date;
}
