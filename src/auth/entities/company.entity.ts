import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column({ default: 'trial' })
  plan: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyFee: number;

  @Column({ default: 5 })
  maxUsers: number;

  @Column({ default: 10 })
  maxDevices: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, user => user.company)
  users: User[];
}
