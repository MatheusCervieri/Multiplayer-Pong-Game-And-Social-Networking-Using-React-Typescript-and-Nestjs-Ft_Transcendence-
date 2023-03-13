import {Controller , Post , Body, Get, Res, Req} from '@nestjs/common';
import { SingUpDTO } from '../singup/singup.dto';
import { UsersService } from 'src/user_database/user.service';
import { User } from 'src/user_database/user.entity';
import { ImageService } from 'src/image/image.service';
import {Image} from '../image/image.entity';
import * as jwt from 'jsonwebtoken';


@Controller('login')
export class LoginController {
    constructor(
        private readonly UsersService: UsersService,
        private readonly imageService: ImageService
        ) {}

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
            
            return e;
        }   
}
@Post('testlogin')
async fortyTwoLoginCallback(@Body() data: {name : string}, @Res() res: any) {
    //Criar usuário
    const user = new User();
    user.email = "";
    //user.name = req.user.name;
    user.name = data.name;
    user.FortytwoId = 0; 
    const databaseuser = await this.UsersService.create(user);
    const token = this.create_JWT(databaseuser);
    databaseuser.token = token;
    const updatedUser = await this.UsersService.update(databaseuser.id, databaseuser);

    //set a default image to the new user:

    
    const defaultImagePath = '/uploads/default.jpg';
    const image = new Image();
    image.filename = 'default.jpg';
    image.mimetype = "image/" + defaultImagePath.split('.').pop();
    image.path = defaultImagePath;
    image.size = 5242880; //5mb
    const imagedatabase = await this.imageService.create(image);
    const userWithImage = await this.UsersService.findWithImage(databaseuser.id);
    userWithImage.image = imagedatabase;
    await this.UsersService.update(databaseuser.id, userWithImage);
    

    //encoding the token
    return res.json(databaseuser.token);
    
  }

  create_JWT(user: User) : any
  {
      const secretKey = process.env.SECRET_KEY;
  
      const payload = { id: user.id, email: user.email };
  
      const token = jwt.sign(payload, secretKey);
  
      return (token);
  }

  getMimeType(file: File): string {
    if (!file.type) {
      throw new Error('File type not supported');
    }
  
    return file.type;
  }

}

