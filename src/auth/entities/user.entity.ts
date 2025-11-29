import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'operator' })
  role: string;

  @Column({ nullable: true })
  companyId: string;

  @ManyToOne(() => Company, company => company.users)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;
}
