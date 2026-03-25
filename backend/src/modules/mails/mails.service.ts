import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: this.resolveRecipient(email),
      subject: 'Account verification',
      template: 'verify-email',
      context: { name, url: this.buildVerificationUrl(token) },
    });
  }

  private resolveRecipient(email: string): string {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    return isProduction
      ? email
      : (this.configService.get<string>('MAIL_TEST') ?? '');
  }

  private buildVerificationUrl(token: string): string {
    const apiUrl = this.configService.getOrThrow<string>('API_URL');
    return `${apiUrl}/verify/${token}`;
  }
}
