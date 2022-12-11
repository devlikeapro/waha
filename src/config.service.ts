import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {WhatsappEngine} from "./structures/enums.dto";

@Injectable()
export class WhatsappConfigService {
    public files_uri = '/api/files'
    public schema = "http"

    constructor(private configService: ConfigService) {
    }

    get filesURL(): string {
        return `${this.schema}://${this.hostname}:${this.port}${this.files_uri}/`
    }

    get hostname(): string {
        return this.configService.get(
            'WHATSAPP_API_HOSTNAME',
            'localhost',
        )
    }

    get port(): string {
        return this.configService.get(
            'WHATSAPP_API_PORT',
            '3000',
        )
    }

    get filesFolder(): string {
        return this.configService.get(
            'WHATSAPP_FILES_FOLDER',
            '/tmp/whatsapp-files',
        )
    }

    get filesLifetime(): number {
        return this.configService.get<number>(
            'WHATSAPP_FILES_LIFETIME',
            180,
        )
    }

    get mimetypes(): string[] | null {
        const types = this.configService.get('WHATSAPP_FILES_MIMETYPES', "")
        return types ? types.split(',') : null
    }

    get startSession(): string | undefined {
        return this.configService.get('WHATSAPP_START_SESSION', undefined)
    }

    getWebhookUrl(): string | undefined {
        return this.get('WHATSAPP_HOOK_URL')
    }

    getWebhookEvents(): string[] {
        const value = this.get('WHATSAPP_HOOK_EVENTS', "")
        return value ? value.split(',') : []
    }

    getDefaultEngineName(): WhatsappEngine {
        const value = this.get("WHATSAPP_DEFAULT_ENGINE", WhatsappEngine.WEBJS)
        if (value in WhatsappEngine) {
            return WhatsappEngine[value]
        }
        console.log(`Unknown WhatsApp default engine, using WEBJS. WHATSAPP_DEFAULT_ENGINE=${value}`)

    }

    get(name: string, defaultValue = undefined): any {
        return this.configService.get(name, defaultValue)
    }

    getApiKey(): string | undefined {
        return this.configService.get("WHATSAPP_API_KEY", "")
    }

    getSwaggerUsernamePassword(): [string, string] | undefined {
        const user = this.configService.get("WHATSAPP_SWAGGER_USERNAME", undefined)
        const password = this.configService.get("WHATSAPP_SWAGGER_PASSWORD", undefined)
        if (!user && !password) {
            console.log("Please set up both WHATSAPP_SWAGGER_USERNAME and WHATSAPP_SWAGGER_PASSWORD " +
                "to enable swagger authentication.")
            return undefined
        }
        return [user, password]
    }
}
