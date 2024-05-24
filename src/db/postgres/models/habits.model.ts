import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('habits')
export class HabitModel {
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
}
