import {Controller , Post, Body} from '@nestjs/common';
import { UsersService } from 'src/user_database/user.service';
import { User } from 'src/user_database/user.entity';

function make_user(data: SingUpDTO)
{
    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.name = "";
    return user;
}

@Controller('setname')
export class SetNameController {
    constructor(private readonly UsersService: UsersService) {}
    @Post()
    async handleData(@Body() data: SingUpDTO) {
        console.log(data);
        await this.UsersService.create(make_user(data));
        return ({message: "User created"})
    }
}
