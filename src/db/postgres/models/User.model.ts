import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserHabit } from './UserHabit.model';
import { HabitContract } from './HabitContract.model';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column('varchar', {
		length: 45
	})
	name!: string;

	@Column('varchar', {
		length: 255,
		unique: true
	})
	email!: string;

	@Column('varchar', {
		length: 255
	})
	password!: string;

	@Column('smallint', {
		default: 3
	})
	sex!: number;

	@Column('int', {
		unsigned: true,
		nullable: true
	})
	age?: number;

	@Column('date', {
		nullable: true
	})
	birthdate?: Date;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	@OneToMany(() => UserHabit, (userHabits) => userHabits.user)
	userHabits!: UserHabit[];

	@OneToMany(() => HabitContract, (habitContract) => habitContract.principal)
	principalHabitContract?: HabitContract;

	@OneToMany(() => HabitContract, (habitContract) => habitContract.trustee)
	trusteeHabitContract?: HabitContract;
}
