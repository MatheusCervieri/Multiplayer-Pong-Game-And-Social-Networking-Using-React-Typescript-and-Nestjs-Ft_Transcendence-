import {Controller , Post, Body} from '@nestjs/common';

@Controller('simple-post')
export class SimplePostController {
    @Post()
    handleData(@Body() data: any) {
        console.log(data);
    }
}
