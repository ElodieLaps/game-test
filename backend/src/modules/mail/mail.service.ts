import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(email: string, name: string, token: string) {
    const url = `${this.configService.get<string>('API_URL')}/verify/${token}`;

    await this.mailerService.sendMail({
      to:
        process.env.NODE_ENV === 'production'
          ? email
          : `${this.configService.get<string>('MAIL_TEST')}`,
      subject: 'Vérification de ton compte',
      template: 'verify-email',
      context: { name, url },
    });
  }
}
