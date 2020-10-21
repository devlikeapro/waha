import {create, Whatsapp} from "venom-bot";
import {Inject, Injectable, OnApplicationShutdown} from "@nestjs/common";

export const whatsappProvider = {
    provide: 'WHATSAPP',
    useFactory: async () => create('sessionName',
        (base64Qr, asciiQR) => {
            console.log(asciiQR);
        },
        (statusFind) => {
            console.log(statusFind);
        },
        {
            headless: true,
            devtools: false,
            useChrome: true,
            debug: false,
            logQR: true,
            browserArgs: ["--no-sandbox"],
            autoClose: 60000,
            disableSpins: true,
            createPathFileToken: true,
            puppeteerOptions: {},
        }
    ),
}

@Injectable()
export class WhatsappService implements OnApplicationShutdown {
    constructor(@Inject('WHATSAPP') private whatsapp: Whatsapp) {
    }

    onApplicationShutdown(signal?: string): any {
        console.log('Close a browser...')
        return this.whatsapp.close()
    }
}