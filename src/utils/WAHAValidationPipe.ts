import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { parseBool } from '@waha/helpers';

// So we can change it to True during development and testing
const WAHA_HTTP_STRICT_MODE = parseBool(process.env.WAHA_HTTP_STRICT_MODE);

export class WAHAValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    options = options || {};
    options.transform = true;
    options.whitelist = true;
    options.forbidNonWhitelisted = WAHA_HTTP_STRICT_MODE;
    super(options);
  }
}
