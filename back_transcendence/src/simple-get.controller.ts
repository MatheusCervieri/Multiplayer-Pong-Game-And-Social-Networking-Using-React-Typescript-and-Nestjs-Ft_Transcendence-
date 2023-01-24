import { Controller , Get } from '@nestjs/common';

@Controller('simple-get')
export class SimpleGetController {
    @Get()
    getHello(): string {
        return 'Banana amarela!';
    }
}
