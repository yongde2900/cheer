import { ValidationError } from '../../../../core';
import { EditUserDto } from './editUser.dto';

describe('EditUserDto', () => {
	beforeAll(() => {});
	it('should create an instance', () => {
		const userData = {
			id: 1,
			name: 'test',
			email: 'some@mail.com',
			password: '123456',
			sex: 1,
			age: 20,
			birthday: new Date('2021-01-01')
		};
		const editUserDto = EditUserDto.create(userData);
		expect(editUserDto).toBeTruthy();
		expect(editUserDto.id).toBe(1);
		expect(editUserDto.name).toBe('test');
		expect(editUserDto.email).toBe('some@mail.com');
		expect(editUserDto.password).toBe('123456');
		expect(editUserDto.sex).toBe(1);
		expect(editUserDto.age).toBe(20);
		if (editUserDto.birthday) {
			expect(editUserDto.birthday.toISOString()).toBe(new Date('2021-01-01').toISOString());
		} else {
			fail('birthday is null');
		}
	});

	it('should throw a validation error', () => {
		expect(() => EditUserDto.create({})).toThrow(ValidationError);
		expect(() => EditUserDto.create({ id: 1, email: '123' })).toThrow(ValidationError);
		expect(() => EditUserDto.create({ id: 1, sex: 5 }));
	});
});
