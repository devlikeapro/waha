import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  SwaggerConfigService,
  SwaggerEnvSchema,
} from '@waha/modules/waha-swagger/swagger.config';
import { SwaggerConfigurator } from '@waha/modules/waha-swagger/SwaggerConfigurator';
import { AppBootstrapModule } from '@waha/plugins/app.bootstrap.module';
import { AppBootstrapService } from '@waha/plugins/AppBootstrapService';
import { WAHA_WEBHOOKS } from '@waha/structures/webhooks';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: SwaggerEnvSchema,
    }),
    AppBootstrapModule,
  ],
  providers: [SwaggerConfigService],
  exports: [SwaggerConfigService],
})
/**
 * Swagger (OpenAPI) UI at / (WHATSAPP_SWAGGER_ENABLED, default true).
 * Optional global basic auth via WHATSAPP_SWAGGER_USERNAME and WHATSAPP_SWAGGER_PASSWORD;
 * mounts the UI through an app bootstrap hook against the built application.
 */
export class SwaggerEnabledModule {
  constructor(bootstrap: AppBootstrapService) {
    bootstrap.register(function configureSwagger(app: INestApplication) {
      const configurator = new SwaggerConfigurator(app);
      configurator.configure(WAHA_WEBHOOKS);
    });
  }
}
