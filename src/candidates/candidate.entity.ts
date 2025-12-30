import { ManyToOne, JoinColumn } from 'typeorm';
import { Company } from 'src/companies/company.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';



@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ length: 30 })
  telefono: string;

  @Column({ length: 120 })
  correo: string;

  @Column({ length: 100 })
  municipio: string;

  @Column({ length: 150 })
  direccion: string;

  @Column({ length: 100 })
  puesto_aplica: string;

  @Column('int')
  anios_experiencia: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pretension_salarial: number;

  @Column({ length: 255 })
  cv_url: string;

   @Column({
    type: 'varchar',
    length: 50,
    default: 'disponible',
  })
  status: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;
  
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Company, (company) => company.candidates, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

}