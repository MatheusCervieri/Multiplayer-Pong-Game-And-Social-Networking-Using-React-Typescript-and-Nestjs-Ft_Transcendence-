import {Controller , Post , Body} from '@nestjs/common';
import { SingUpDTO } from '../singup/singup.dto';
import { UsersService } from 'src/user_database/user.service';


@Controller('login')
export class LoginController {
    constructor(private readonly UsersService: UsersService) {}
    @Post()
    async handleData(@Body() data: SingUpDTO) {
        console.log(data);
        const user = await this.UsersService.findOneEmail(data.email);
        return (user.token);
    }
}

