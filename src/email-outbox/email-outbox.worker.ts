import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailOutbox } from './email-outbox.entity';
import { EmailService } from '../emails/email.service';

@Injectable()
export class EmailOutboxWorker {
  constructor(
    @InjectRepository(EmailOutbox)
    private readonly repo: Repository<EmailOutbox>,
    private readonly emailService: EmailService,
  ) {}

  @Cron('*/30 * * * * *') // cada 30 segundos
  async process() {
    const items = await this.repo.find({
      where: { status: 'pending' },
      order: { created_at: 'ASC' },
      take: 10, // batch pequeño para demo
    });

    for (const item of items) {
      try {
        await this.repo.update(item.id, { status: 'sending' });

        await this.emailService.sendHtml(
          item.to_email,
          item.subject,
          item.body_html,
        );

        await this.repo.update(item.id, {
          status: 'sent',
          sent_at: new Date(),
          last_error: null,
        });
      } catch (err: any) {
        await this.repo.update(item.id, {
          status: 'failed',
          attempts: item.attempts + 1,
          last_error: err?.message || 'Error enviando correo',
        });
      }
    }
  }
}
