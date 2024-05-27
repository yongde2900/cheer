import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Habit } from './Habit.model';
import { User } from './User.model';
import { UserHabitRecord } from './UserHabitRecord.model';
import { HabitContract } from './HabitContract.model';

@Entity('user_habits')
export class UserHabit {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('int', {
		unsigned: true,
		comment: 'unit: days'
	})
	frenquency!: number;

	@Column('date')
	started_at!: Date;

	@Column('boolean')
	is_active!: boolean;

	@Column('date')
	next_time!: Date;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	// Relation
	@ManyToOne(() => Habit, (habit) => habit.userHabits)
	@JoinColumn({ name: 'habit_id' })
	habit!: Habit;

	@ManyToOne(() => User, (user) => user.userHabits)
	@JoinColumn({ name: 'user_id' })
	user!: User;

	@OneToMany(() => UserHabitRecord, (userHabitRecord) => userHabitRecord.userHabit)
	userHabitRecords!: UserHabitRecord[];

	@OneToOne(() => HabitContract, (habitContract) => habitContract.userHabit)
	habitContract!: HabitContract;
}
