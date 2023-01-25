import { Controller , Get } from '@nestjs/common';
import { Email } from './email.entity';
import { EmailService } from './services/email.service';

@Controller('simple-get')
export class SimpleGetController {
    constructor(private emailService: EmailService) {}

    @Get()
    async getEmails(): Promise<Email[]> {
        return this.emailService.findAll();
    }
}
