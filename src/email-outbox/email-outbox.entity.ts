import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('email_outbox')
export class EmailOutbox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  company_id: number | null;

  @Column({ type: 'int', nullable: true })
  candidate_id: number | null;

  @Column()
  to_email: string;

  @Column()
  subject: string;

  @Column({ type: 'mediumtext' })
  body_html: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'sending' | 'sent' | 'failed';

  @Column({ default: 0 })
  attempts: number;

  @Column({ type: 'text', nullable: true })
  last_error: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date | null;
}
