import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserHabit } from './UserHabit.model';
import { User } from './User.model';

@Entity('habit_contracts')
export class HabitContract {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('varchar', {
		length: 45
	})
	name!: string;

	@Column('text')
	requirement!: string;

	@OneToOne(() => UserHabit, (userHabit) => userHabit.habitContract)
	userHabit!: UserHabit;

	@ManyToOne(() => User, (principal) => principal.principalHabitContract)
	@JoinColumn({ name: 'principal' })
	principal!: User;

	@ManyToOne(() => User, (trustee) => trustee.trusteeHabitContract)
	@JoinColumn({ name: 'trustee' })
	trustee!: User;
}
