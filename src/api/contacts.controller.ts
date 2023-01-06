import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {SessionManager} from "../core/abc/manager.abc";
import {ContactQuery, ContactRequest} from "../structures/contacts.dto";
import {SessionQuery} from "../structures/base.dto";

@ApiSecurity('api_key')
@Controller('api/contacts')
@ApiTags('contacts')
export class ContactsController {
    constructor(private manager: SessionManager) {
    }

    @Get('/')
    @ApiOperation({summary: 'Get contact basic info'})
    get(@Query() query: ContactQuery) {
        const whatsapp = this.manager.getSession(query.session)
        return whatsapp.getContact(query)
    }

    @Get('/all')
    @ApiOperation({summary: 'Get all contacts'})
    getAll(@Query() query: SessionQuery) {
        const whatsapp = this.manager.getSession(query.session)
        return whatsapp.getContacts()
    }

    @Get('/about')
    @ApiOperation({summary: 'Gets the Contact\'s current "about" info. Returns null if you don\'t have permission to read their status.'})
    getAbout(@Query() query: ContactQuery) {
        const whatsapp = this.manager.getSession(query.session)
        return whatsapp.getContactAbout(query)
    }

    @Get('/profile-picture')
    @ApiOperation({summary: 'Returns the contact\'s profile picture URL, if privacy settings allow it.'})
    getProfilePicture(@Query() query: ContactQuery) {
        const whatsapp = this.manager.getSession(query.session)
        return whatsapp.getContactProfilePicture(query)
    }

    @Post('/block')
    @ApiOperation({summary:"Block contact"})
    block(@Body() request: ContactRequest) {
        const whatsapp = this.manager.getSession(request.session)
        return whatsapp.blockContact(request)
    }
    @Post('/unblock')
    @ApiOperation({summary:"Unblock contact"})
    unblock(@Body() request: ContactRequest) {
        const whatsapp = this.manager.getSession(request.session)
        return whatsapp.unblockContact(request)
    }
}
