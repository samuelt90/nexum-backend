import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailOutbox } from './email-outbox.entity';
import { EmailOutboxWorker } from './email-outbox.worker';
import { EmailService } from 'src/emails/email.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([EmailOutbox]),
  ],
  providers: [EmailOutboxWorker, EmailService],
})
export class EmailOutboxModule {}