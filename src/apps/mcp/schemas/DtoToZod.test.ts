import 'reflect-metadata';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

import { DtoToZod } from './DtoToZod';

function expectSchemasToEqual(schema1: z.ZodType, schema2: z.ZodType) {
  expect(z.toJSONSchema(schema1)).toEqual(z.toJSONSchema(schema2));
}

describe('DtoToZod', () => {
  describe('primitive types', () => {
    it('converts @IsString to z.string()', () => {
      class Dto {
        @IsString()
        name: string;
      }

      const Expected = z.object({
        name: z.string(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('converts @IsNumber to z.number()', () => {
      class Dto {
        @IsNumber()
        count: number;
      }

      const Expected = z.object({
        count: z.number(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('converts @IsBoolean to z.boolean()', () => {
      class Dto {
        @IsBoolean()
        flag: boolean;
      }

      const Expected = z.object({
        flag: z.boolean(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('optional fields', () => {
    it('marks @IsOptional fields as optional', () => {
      class Dto {
        @IsNumber()
        @IsOptional()
        limit?: number;
      }

      const Expected = z.object({
        limit: z.number().optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('marks @ApiPropertyOptional fields as optional', () => {
      class Dto {
        @IsString()
        @ApiPropertyOptional({ description: 'Optional name' })
        name?: string;
      }

      const Expected = z.object({
        name: z.string().optional().describe('Optional name'),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('marks @ApiProperty({ required: false }) fields as optional', () => {
      class Dto {
        @IsBoolean()
        @ApiProperty({ required: false })
        active?: boolean;
      }

      const Expected = z.object({
        active: z.boolean().optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('required fields fail without value', () => {
      class Dto {
        @IsString()
        name: string;
      }

      const Expected = z.object({
        name: z.string(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('default values', () => {
    it('picks up default from class field initializer', () => {
      class Dto {
        @IsBoolean()
        @IsOptional()
        active?: boolean = true;
      }

      const Expected = z.object({
        active: z.boolean().optional().default(true),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('picks up default from @ApiProperty', () => {
      class Dto {
        @IsBoolean()
        @IsOptional()
        @ApiProperty({ default: false, description: 'Enable feature' })
        enabled?: boolean;
      }

      const Expected = z.object({
        enabled: z
          .boolean()
          .optional()
          .default(false)
          .describe('Enable feature'),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('does not apply default to required fields', () => {
      class Dto {
        @IsNumber()
        count: number;
      }

      const Expected = z.object({
        count: z.number(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('prefers @ApiProperty default over instance default', () => {
      class Dto {
        @IsNumber()
        @IsOptional()
        @ApiProperty({ default: 99 })
        val?: number = 1;
      }

      const Expected = z.object({
        val: z.number().optional().default(99),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('descriptions', () => {
    it('applies @ApiProperty description to required field', () => {
      class Dto {
        @IsString()
        @ApiProperty({ description: 'Session identifier' })
        session: string;
      }

      const Expected = z.object({
        session: z.string().describe('Session identifier'),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('applies description to optional field with default', () => {
      class Dto {
        @IsBoolean()
        @IsOptional()
        @ApiProperty({
          description: 'Include stopped sessions',
          default: false,
        })
        all?: boolean;
      }

      const Expected = z.object({
        all: z
          .boolean()
          .optional()
          .default(false)
          .describe('Include stopped sessions'),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('string refinements', () => {
    it('applies @IsUrl as .url()', () => {
      class Dto {
        @IsUrl()
        webhookUrl: string;
      }

      const Expected = z.object({
        webhookUrl: z.string().url(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('applies @MaxLength', () => {
      class Dto {
        @IsString()
        @MaxLength(10)
        name: string;
      }

      const Expected = z.object({
        name: z.string().max(10),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('applies @Matches regex', () => {
      class Dto {
        @IsString()
        @Matches(/^[a-z]+$/)
        slug: string;
      }

      const Expected = z.object({
        slug: z.string().regex(/^[a-z]+$/),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('chains multiple string refinements', () => {
      class Dto {
        @IsString()
        @MaxLength(54)
        @Matches(/^[a-zA-Z0-9_-]*$/)
        sessionName: string;
      }

      const Expected = z.object({
        sessionName: z
          .string()
          .max(54)
          .regex(/^[a-zA-Z0-9_-]*$/),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('enums', () => {
    it('converts string enum with @IsEnum', () => {
      enum Color {
        RED = 'red',
        GREEN = 'green',
        BLUE = 'blue',
      }

      class Dto {
        @IsEnum(Color)
        color: Color;
      }

      const Expected = z.object({
        color: z.nativeEnum(Color),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('converts numeric enum with @IsEnum', () => {
      enum Priority {
        LOW = 1,
        MEDIUM = 2,
        HIGH = 3,
      }

      class Dto {
        @IsEnum(Priority)
        @IsOptional()
        priority?: Priority;
      }

      const Expected = z.object({
        priority: z.nativeEnum(Priority).optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('@IsIn union', () => {
    it('creates union of number literals from @IsIn', () => {
      class Dto {
        @IsIn([86400, 604800, 2592000])
        duration: number;
      }

      const Expected = z.object({
        duration: z.number(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('creates union of string literals from @IsIn', () => {
      class Dto {
        @IsIn(['asc', 'desc'])
        @IsOptional()
        @ApiProperty({ default: 'desc' })
        order?: string;
      }

      const Expected = z.object({
        order: z.string().optional().default('desc'),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('nested objects', () => {
    it('converts @ValidateNested + @Type to nested ZodObject', () => {
      class AddressDto {
        @IsString()
        @ApiProperty({ description: 'City name' })
        city: string;
      }

      class Dto {
        @ValidateNested()
        @Type(() => AddressDto)
        @IsOptional()
        address?: AddressDto;
      }

      const Expected = z.object({
        address: z
          .object({
            city: z.string().describe('City name'),
          })
          .optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('propagates descriptions from nested DTO fields', () => {
      class AddressDto {
        @IsString()
        @ApiProperty({ description: 'City name' })
        city: string;
      }

      class Dto {
        @ValidateNested()
        @Type(() => AddressDto)
        @IsOptional()
        address?: AddressDto;
      }

      const Expected = z.object({
        address: z
          .object({
            city: z.string().describe('City name'),
          })
          .optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('arrays', () => {
    it('converts @IsArray + @IsString({ each }) to z.array(z.string())', () => {
      class Dto {
        @IsArray()
        @IsString({ each: true })
        tags: string[];
      }

      const Expected = z.object({
        tags: z.array(z.string()),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('converts array of nested DTOs', () => {
      class ItemDto {
        @IsString()
        label: string;
      }

      class Dto {
        @ValidateNested({ each: true })
        @Type(() => ItemDto)
        @IsArray()
        @IsOptional()
        items?: ItemDto[];
      }

      const Expected = z.object({
        items: z
          .array(
            z.object({
              label: z.string(),
            }),
          )
          .optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('converts @IsArray + @IsEnum({ each }) to array of enum', () => {
      enum Status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
      }

      class Dto {
        @IsArray()
        @IsEnum(Status, { each: true })
        @IsOptional()
        statuses?: Status[];
      }

      const Expected = z.object({
        statuses: z.array(z.nativeEnum(Status)).optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('plugin-generated fields (undecorated)', () => {
    it('handles required undecorated field', () => {
      class Dto {
        field: string;
        static _OPENAPI_METADATA_FACTORY() {
          return { field: { required: true, type: () => String } };
        }
      }

      const Expected = z.object({
        field: z.string(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('handles optional undecorated field', () => {
      class Dto {
        field?: string;
        static _OPENAPI_METADATA_FACTORY() {
          return { field: { required: false, type: () => String } };
        }
      }

      const Expected = z.object({
        field: z.string().optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('handles optional number with default from factory', () => {
      class Dto {
        count?: number;
        static _OPENAPI_METADATA_FACTORY() {
          return {
            count: { required: false, type: () => Number, default: 10 },
          };
        }
      }

      const Expected = z.object({
        count: z.number().optional().default(10),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('handles optional boolean with description from factory', () => {
      class Dto {
        verbose?: boolean;
        static _OPENAPI_METADATA_FACTORY() {
          return {
            verbose: {
              required: false,
              type: () => Boolean,
              description: 'Enable verbose output',
            },
          };
        }
      }

      const Expected = z.object({
        verbose: z.boolean().optional().describe('Enable verbose output'),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('handles array field from factory', () => {
      class Dto {
        tags: string[];
        static _OPENAPI_METADATA_FACTORY() {
          return { tags: { required: true, type: () => [String] } };
        }
      }

      const Expected = z.object({
        tags: z.array(z.string()),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });

    it('handles mix of decorated and undecorated fields', () => {
      class Dto {
        @IsString()
        name: string;

        age?: number;
        static _OPENAPI_METADATA_FACTORY() {
          return { age: { required: false, type: () => Number } };
        }
      }

      const Expected = z.object({
        name: z.string(),
        age: z.number().optional(),
      });
      expectSchemasToEqual(DtoToZod(Dto), Expected);
    });
  });

  describe('inheritance', () => {
    it('includes parent class fields', () => {
      class BaseDto {
        @IsString()
        @ApiProperty({ description: 'Unique ID' })
        id: string;
      }

      class ChildDto extends BaseDto {
        @IsNumber()
        @IsOptional()
        count?: number;
      }

      const Expected = z.object({
        id: z.string().describe('Unique ID'),
        count: z.number().optional(),
      });
      expectSchemasToEqual(DtoToZod(ChildDto), Expected);
    });

    it('inherits parent field types and descriptions', () => {
      class BaseDto {
        @IsString()
        @ApiProperty({ description: 'Unique ID' })
        id: string;
      }

      class ChildDto extends BaseDto {
        @IsNumber()
        @IsOptional()
        count?: number;
      }

      const Expected = z.object({
        id: z.string().describe('Unique ID'),
        count: z.number().optional(),
      });
      expectSchemasToEqual(DtoToZod(ChildDto), Expected);
    });

    it('parent required fields remain required in child', () => {
      class BaseDto {
        @IsString()
        id: string;
      }

      class ChildDto extends BaseDto {
        @IsNumber()
        @IsOptional()
        count?: number;
      }

      const Expected = z.object({
        id: z.string(),
        count: z.number().optional(),
      });
      expectSchemasToEqual(DtoToZod(ChildDto), Expected);
    });
  });
});
