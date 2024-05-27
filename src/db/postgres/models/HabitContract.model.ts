import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

	@OneToMany(() => User, (principal) => principal.principalHabitContract)
	@JoinColumn({ name: 'principal' })
	principal!: User;

	@OneToMany(() => User, (trustee) => trustee.trusteeHabitContract)
	@JoinColumn({ name: 'trustee' })
	trustee!: User;
}
