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

	it('should throw an ValidationError', () => {
		try {
			HabitEntity.fromJson({ id: '1', name: 1, description: 1 });
		} catch (e) {
			expect(e).toBeInstanceOf(ValidationError);
		}
	});
});
