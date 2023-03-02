import {Controller , Post, Body} from '@nestjs/common';
import { SingUpDTO } from './singup.dto';
import { UsersService } from 'src/user_database/user.service';
import { User } from 'src/user_database/user.entity';
import * as jwt from 'jsonwebtoken';


function make_user(data: SingUpDTO)
{
    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.name = "";
    return user;
}

function create_JWT(user: User) : any
{
    const secretKey = process.env.SECRET_KEY;

    const payload = { id: user.id, email: user.email };

    const token = jwt.sign(payload, secretKey);

    return (token);
}

function set_token(user: User, token: string)
{
    user.token = token;
}

@Controller('sing-up')
export class SingUpController {
    constructor(private readonly UsersService: UsersService) {}
    @Post()
    async handleData(@Body() data: SingUpDTO) {
        console.log(data);
        const user = make_user(data);
        await this.UsersService.create(user);
        const savedUser = await this.UsersService.findOneEmail(user.email) ;
        const token = create_JWT(savedUser);
        set_token(savedUser, token);
        console.log(savedUser.token);
        console.log("ID: ", savedUser.id);
        await this.UsersService.update(savedUser.id, savedUser);
        return (token);
    }
}

