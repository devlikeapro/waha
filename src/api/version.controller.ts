import {Controller, Get} from '@nestjs/common';
import {ApiSecurity, ApiTags} from "@nestjs/swagger";
import {VERSION} from "../version";


@ApiSecurity('api_key')
@Controller('api/version')
@ApiTags('other')
export class VersionController {
    @Get('')
    async get() {
        return VERSION
    }
}

