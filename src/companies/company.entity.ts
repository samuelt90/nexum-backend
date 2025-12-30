import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Candidate } from '../candidates/candidate.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Candidate, (candidate) => candidate.company)
  candidates: Candidate[];
}
