import {Controller , Post , Body} from '@nestjs/common';
import { SingUpDTO } from '../singup/singup.dto';
import { UsersService } from 'src/user_database/user.service';


@Controller('login')
export class LoginController {
    constructor(private readonly UsersService: UsersService) {}
    @Post()
    async handleData(@Body() data: SingUpDTO) {
        
        try
        {
        const user = await this.UsersService.findOneEmail(data.email);
            if (user)
            {
                if (user.password === data.password)
                {
                    if(user.TwofaAactive === true)
                    {
                        //Redirecionar para autenticação de dois fatores. 
                    }
                    else 
                    {
                        return (user.token);
                    }
                }
                else
                    throw new Error("Invalid password");
            }
        return (user.token);
        }
        catch (e)
        {
            console.log(e);
            return e;
        }
}
}

