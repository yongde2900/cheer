import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	JoinColumn
} from 'typeorm';
import { UserHabit } from './UserHabit.model';
import { HabitCategory } from './HabitCategory.model';

@Entity('habits')
export class Habit {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column('text')
	description!: string;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	// Relation

	@OneToMany(() => UserHabit, (userHabits) => userHabits.habit)
	userHabits!: UserHabit[];

	@ManyToOne(() => HabitCategory, (habitCategory) => habitCategory.habits)
	@JoinColumn({ name: 'habit_category_id' })
	habitCategory!: HabitCategory;
}
