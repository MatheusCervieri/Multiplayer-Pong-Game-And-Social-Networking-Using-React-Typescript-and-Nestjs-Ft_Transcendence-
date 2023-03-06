import { Injectable } from '@nestjs/common';
import { MailService as SendGridMailService } from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly sendGridMailService: SendGridMailService;

  constructor() {
    this.sendGridMailService = new SendGridMailService();
    this.sendGridMailService.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to: string, subject: string, text: string) {
    const msg = {
      to,
      from: 'mathcervieri@gmail.com',
      subject,
      text,
    };

    return this.sendGridMailService.send(msg);
  }
}