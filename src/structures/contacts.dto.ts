import {IsString} from "class-validator";
import {SessionBaseRequest, SessionQuery} from "./base.dto";


/**
 * Queries
 */

export class ContactQuery extends SessionQuery {
    @IsString()
    contactId: string
}


/**
 * Requests
 */

export class ContactRequest extends SessionBaseRequest {
    @IsString()
    contactId: string
}
