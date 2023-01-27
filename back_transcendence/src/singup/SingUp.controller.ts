import {Controller , Post, Body} from '@nestjs/common';
import { SingUpDTO } from './singup.dto';

@Controller('sing-up')
export class SingUpController {

    @Post()
    async handleData(@Body() data: SingUpDTO) {
        console.log(data);
    }
}
