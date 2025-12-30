import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') ?? '587');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (!host || !port || !user || !pass) {
      this.logger.warn('SMTP no configurado (faltan variables SMTP_* en .env).');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user, pass },
    });
  }

  async sendHtml(to: string, subject: string, html: string) {
    if (!this.transporter) {
      throw new Error('SMTP no configurado. Revisa SMTP_* en .env');
    }

    const from = this.config.get<string>('SMTP_FROM') || this.config.get<string>('SMTP_USER');

    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    return info;
  }
}
