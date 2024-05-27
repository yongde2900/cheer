import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Habit } from './Habit.model';

@Entity('habit_categories')
export class HabitCategory {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('varchar', {
		length: 45
	})
	name!: string;

	@Column('text')
	description!: string;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	// Relation

	@OneToMany(() => Habit, (habit) => habit.habitCategory)
	habits!: Habit[];

	@OneToMany(() => HabitCategory, (habitCategory) => habitCategory.parent)
	children!: HabitCategory[];

	@ManyToOne(() => HabitCategory, (habitCategory) => habitCategory.children)
	@JoinColumn({ name: 'parent_id' })
	parent!: HabitCategory;
}
