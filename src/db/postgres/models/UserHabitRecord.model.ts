import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { UserHabit } from './UserHabit.model';

@Entity('user_habit_records')
export class UserHabitRecord {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('timestamp without time zone')
	completed_at!: Date;

	@Column('smallint', {
		unsigned: true
	})
	status!: number;

	@Column('text')
	comment!: string;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	// Relation
	@ManyToOne(() => UserHabit, (userHabit) => userHabit.userHabitRecords)
	@JoinColumn({ name: 'user_habit_id' })
	userHabit!: UserHabit;
}
