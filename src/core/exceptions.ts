import {UnprocessableEntityException} from "@nestjs/common";

export const DOCS_URL = "https://waha.devlike.pro/"

export class NotImplementedByEngineError extends UnprocessableEntityException {
    constructor(msg = "") {
        let error = "The method is not implemented by the engine."
        if (msg) {
            error += ` ${msg}`
        }
        super(error);
    }
}


export class AvailableInPlusVersion extends UnprocessableEntityException {
    constructor() {
        super(`The feature is available only in Plus version. Check this out: ${DOCS_URL}`);
    }
}
