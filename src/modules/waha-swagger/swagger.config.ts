import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth } from '@waha/core/auth/config';
import { parseBool } from '@waha/helpers';
import * as Joi from 'joi';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

enum Env {
  WHATSAPP_SWAGGER_ENABLED = 'WHATSAPP_SWAGGER_ENABLED',
  WHATSAPP_SWAGGER_CONFIG_ADVANCED = 'WHATSAPP_SWAGGER_CONFIG_ADVANCED',
  WHATSAPP_SWAGGER_USERNAME = 'WHATSAPP_SWAGGER_USERNAME',
  WHATSAPP_SWAGGER_PASSWORD = 'WHATSAPP_SWAGGER_PASSWORD',
  WHATSAPP_SWAGGER_NO_PASSWORD = 'WHATSAPP_SWAGGER_NO_PASSWORD',
  WHATSAPP_SWAGGER_TITLE = 'WHATSAPP_SWAGGER_TITLE',
  WHATSAPP_SWAGGER_DESCRIPTION = 'WHATSAPP_SWAGGER_DESCRIPTION',
  WHATSAPP_SWAGGER_EXTERNAL_DOC_URL = 'WHATSAPP_SWAGGER_EXTERNAL_DOC_URL',
}

export const SwaggerEnvSchema = Joi.object({
  [Env.WHATSAPP_SWAGGER_ENABLED]: Joi.boolean()
    .truthy('1', 'yes')
    .falsy('0', 'no'),
  [Env.WHATSAPP_SWAGGER_CONFIG_ADVANCED]: Joi.boolean()
    .truthy('1', 'yes')
    .falsy('0', 'no'),
  [Env.WHATSAPP_SWAGGER_USERNAME]: Joi.string().allow(''),
  [Env.WHATSAPP_SWAGGER_PASSWORD]: Joi.string().allow(''),
  [Env.WHATSAPP_SWAGGER_NO_PASSWORD]: Joi.boolean()
    .truthy('1', 'yes')
    .falsy('0', 'no'),
  [Env.WHATSAPP_SWAGGER_TITLE]: Joi.string().allow(''),
  [Env.WHATSAPP_SWAGGER_DESCRIPTION]: Joi.string().allow(''),
  [Env.WHATSAPP_SWAGGER_EXTERNAL_DOC_URL]: Joi.string().allow(''),
});

export function isSwaggerEnabled(env: NodeJS.ProcessEnv): boolean {
  const value = env[Env.WHATSAPP_SWAGGER_ENABLED];
  if (!value) {
    return true;
  }
  return parseBool(value);
}

@Injectable()
export class SwaggerConfigService {
  constructor(
    protected configService: ConfigService,
    @InjectPinoLogger('SwaggerConfigService')
    protected logger: PinoLogger,
  ) {}

  get advancedConfigEnabled(): boolean {
    const value = this.configService.get(
      Env.WHATSAPP_SWAGGER_CONFIG_ADVANCED,
      false,
    );
    return parseBool(value);
  }

  get credentials(): [string, string] | undefined {
    const user = Auth.swagger.username.value;
    const password = Auth.swagger.password.value;
    if (!user && !password) {
      return null;
    }
    if ((user && !password) || (!user && password)) {
      this.logger.warn(
        'Set up both WHATSAPP_SWAGGER_USERNAME and WHATSAPP_SWAGGER_PASSWORD ' +
          'to enable swagger authentication.',
      );
      return null;
    }
    return [user, password];
  }

  get title() {
    return this.configService.get(Env.WHATSAPP_SWAGGER_TITLE, '');
  }

  get description() {
    return this.configService.get(Env.WHATSAPP_SWAGGER_DESCRIPTION, '');
  }

  get externalDocUrl() {
    return this.configService.get(Env.WHATSAPP_SWAGGER_EXTERNAL_DOC_URL, '');
  }
}
