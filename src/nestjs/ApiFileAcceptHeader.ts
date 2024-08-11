import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Base64File } from '@waha/structures/files.dto';

function getRefSchemaPaths(models) {
  return models.map((model) => {
    return { $ref: getSchemaPath(model) };
  });
}

/**
 * Decorator to add a file accept header to the swagger documentation
 */
export function ApiFileAcceptHeader(...models) {
  models = models.length ? models : [Base64File];
  return applyDecorators(
    // Add extra models, otherwise it'll give a error
    // $ref not found
    ApiExtraModels(...models),
    ApiResponse({
      status: 200,
      content: {
        'image/png': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
        'application/json': {
          schema: {
            oneOf: getRefSchemaPaths(models),
          },
        },
      },
    }),
  );
}
