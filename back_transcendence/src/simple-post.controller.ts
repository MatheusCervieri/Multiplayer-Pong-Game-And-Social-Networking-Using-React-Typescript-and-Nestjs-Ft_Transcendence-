import {Controller , Post, Body} from '@nestjs/common';
import { EmailService } from './services/email.service';
import { Email } from './email.entity';

@Controller('simple-post')
export class SimplePostController {
    constructor(private readonly emailService: EmailService) 
    {}
    @Post()
    async handleData(@Body() data: any) {
        
        const email = new Email();
        email.email = data.email;
        await this.emailService.create(email);
    }
}
