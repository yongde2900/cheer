import { ValidationError } from '../../../../core/errors/validation.error';
import { HabitEntity } from './habit.entity';

describe('HabitEntity', () => {
	it('should create an instance', () => {
		expect(new HabitEntity(1, 'test', 'test')).toBeTruthy();
	});

	it('should create an instance from json', () => {
		const habit = HabitEntity.fromJson({ id: 1, name: 'test', description: 'test' });
		expect(habit).toBeTruthy();
	});

	it('should throw an ValidationError via constrouctor', () => {
		expect(() => {
			const habit = new HabitEntity(101, 'test', 'test');
			HabitEntity.validate(habit);
		}).toThrow(ValidationError);
	});

	it('should throw an ValidationError via fromJson function', () => {
		expect(() => HabitEntity.fromJson({ id: 1 })).toThrow(ValidationError);
	});
});
