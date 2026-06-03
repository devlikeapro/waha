import 'reflect-metadata';

import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { getMetadataStorage } from 'class-validator';
import { z } from 'zod';

// ──────────────────────────────────────────────────────────────────────────────
// Public types
// ──────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = any> = new (...args: any[]) => T;

export type DtoShape<T> = {
  [K in keyof T & string]: z.ZodType<T[K]>;
};

// ──────────────────────────────────────────────────────────────────────────────
// Internal metadata interfaces
// ──────────────────────────────────────────────────────────────────────────────

interface CvConstraint {
  type: string;
  name: string;
  propertyName: string;
  constraints: unknown[];
  each: boolean;
}

// Built-in decorators (@IsString, @IsArray, etc.) use type='customValidation' with
// the real name in `name`. Special decorators (@IsOptional, @ValidateNested) use
// a descriptive `type` directly with no `name`.
function constraintKey(c: CvConstraint): string {
  return c.type === 'customValidation' ? c.name : c.type;
}

interface TypeMeta {
  typeFunction?: () => Constructor;
  propertyName: string;
}

interface ApiPropertyMeta {
  description?: string;
  default?: unknown;
  // Explicitly set via @ApiPropertyOptional() or @ApiProperty({ required: false })
  required?: boolean;
  // design:type merged by NestJS Swagger at decoration time — already a constructor
  type?: unknown;
  isArray?: boolean;
}

// Shape of entries returned by the _OPENAPI_METADATA_FACTORY static method that
// the @nestjs/swagger compiler plugin generates for every DTO property.
interface FactoryPropertyMeta {
  required?: boolean;
  // Lazy constructor ref: `() => String`, or array notation: `() => [String]`
  type?: () => unknown;
  default?: unknown;
  description?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────

// class-validator constraint type names
const CV_IS_STRING = 'isString';
const CV_IS_BOOLEAN = 'isBoolean';
const CV_IS_NUMBER = 'isNumber';
const CV_IS_INT = 'isInt';
const CV_IS_ARRAY = 'isArray';
const CV_IS_ENUM = 'isEnum';
const CV_NESTED = 'nestedValidation';
const CV_OPTIONAL = 'conditionalValidation'; // @IsOptional / @ValidateIf
const CV_IS_URL = 'isUrl';
const CV_MAX_LENGTH = 'maxLength';
const CV_MATCHES = 'matches';
const CV_IS_IN = 'isIn';

// NestJS Swagger reflect-metadata keys (stable since @nestjs/swagger v3)
const SW_PROPS = 'swagger/apiModelProperties';
const SW_PROPS_ARRAY = 'swagger/apiModelPropertiesArray';
// Static method injected by the @nestjs/swagger compiler plugin on every DTO
const METADATA_FACTORY_NAME = '_OPENAPI_METADATA_FACTORY';

function collectPropertyNames(cls: Constructor): string[] {
  const names = new Set<string>();

  // @ApiProperty-decorated properties — walk prototype chain
  let proto: object = cls.prototype;
  while (proto && proto !== Object.prototype) {
    const arr =
      (Reflect.getMetadata(SW_PROPS_ARRAY, proto) as string[] | undefined) ??
      [];
    for (const entry of arr) {
      names.add(entry.startsWith(':') ? entry.slice(1) : entry);
    }
    proto = Object.getPrototypeOf(proto) as object;
  }

  // class-validator metadata (handles inheritance internally)
  const cvAll = getMetadataStorage().getTargetValidationMetadatas(
    cls,
    '',
    false,
    false,
  ) as CvConstraint[];
  for (const meta of cvAll) {
    names.add(meta.propertyName);
  }

  // _OPENAPI_METADATA_FACTORY — plugin-generated, covers undecorated properties
  for (const key of Object.keys(getClassFactoryMeta(cls))) {
    names.add(key);
  }

  return [...names];
}

// Reads the _OPENAPI_METADATA_FACTORY static method walking the constructor chain
// so that parent-class factory entries are merged (child takes precedence).
function getClassFactoryMeta(
  cls: Constructor,
): Record<string, FactoryPropertyMeta> {
  const result: Record<string, FactoryPropertyMeta> = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let ctor: Function = cls;
  while (ctor && ctor !== Object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const factory = (ctor as any)[METADATA_FACTORY_NAME] as unknown;
    if (typeof factory === 'function') {
      const meta = (factory as () => Record<string, FactoryPropertyMeta>)();
      for (const [key, val] of Object.entries(meta)) {
        if (!(key in result)) result[key] = val;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ctor = Object.getPrototypeOf(ctor) as Function;
  }
  return result;
}

function getConstraints(cls: Constructor, prop: string): CvConstraint[] {
  const all = getMetadataStorage().getTargetValidationMetadatas(
    cls,
    '',
    false,
    false,
  ) as CvConstraint[];
  return all.filter((m) => m.propertyName === prop);
}

// Walks the constructor chain because class-transformer stores type metadata
// on the exact constructor where @Type() was declared.
function getTypeMeta(cls: Constructor, prop: string): TypeMeta | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let ctor: Function = cls;
  while (ctor && ctor !== Object && typeof ctor.prototype !== 'undefined') {
    const meta = defaultMetadataStorage.findTypeMetadata(ctor, prop) as
      | TypeMeta
      | undefined;
    if (meta?.typeFunction) return meta;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ctor = Object.getPrototypeOf(ctor) as Function;
  }
  return undefined;
}

function getApiPropertyMeta(
  cls: Constructor,
  prop: string,
): ApiPropertyMeta | undefined {
  let proto: object = cls.prototype;
  while (proto && proto !== Object.prototype) {
    const meta = Reflect.getMetadata(SW_PROPS, proto, prop) as
      | ApiPropertyMeta
      | undefined;
    if (meta !== undefined) return meta;
    proto = Object.getPrototypeOf(proto) as object;
  }
  return undefined;
}

function getDesignType(cls: Constructor, prop: string): unknown {
  let proto: object = cls.prototype;
  while (proto && proto !== Object.prototype) {
    const type = Reflect.getMetadata('design:type', proto, prop);
    if (type !== undefined) return type;
    proto = Object.getPrototypeOf(proto) as object;
  }
  return undefined;
}

function getInstanceDefault(cls: Constructor, prop: string): unknown {
  try {
    const instance = new cls() as Record<string, unknown>;
    const val = instance[prop];
    return val !== undefined ? val : undefined;
  } catch {
    return undefined;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Schema builders
// ──────────────────────────────────────────────────────────────────────────────

function inferFromDesignType(type: unknown): z.ZodTypeAny {
  if (type === String) return z.string();
  if (type === Boolean) return z.boolean();
  if (type === Number) return z.number();
  if (type === Array) return z.array(z.unknown());
  // Record<*, *> and plain objects — TypeScript emits Object for both
  if (type === Object) return z.record(z.string(), z.unknown());
  return z.unknown();
}

function buildStringSchema(cs: CvConstraint[]): z.ZodString {
  let schema = z.string();
  for (const c of cs) {
    const key = constraintKey(c);
    if (key === CV_IS_URL) {
      schema = schema.url();
    } else if (key === CV_MAX_LENGTH) {
      schema = schema.max(c.constraints[0] as number);
    } else if (key === CV_MATCHES) {
      schema = schema.regex(c.constraints[0] as RegExp);
    }
  }
  return schema;
}

function buildEnumSchema(cs: CvConstraint[]): z.ZodTypeAny {
  const c = cs.find((m) => constraintKey(m) === CV_IS_ENUM);
  if (!c) return z.string();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return z.nativeEnum(c.constraints[0] as any);
}

// function buildIsInSchema(cs: CvConstraint[]): z.ZodTypeAny {
//   const c = cs.find((m) => m.type === CV_IS_IN);
//   if (!c) return z.unknown();
//
//   const values = c.constraints[0] as unknown[];
//   if (values.length === 0) return z.unknown();
//
//   const [first, second, ...rest] = values.map((v) => z.literal(v));
//   return z.union([
//     first,
//     second,
//     ...rest,
//   ] as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);
// }

// Determines the (element) Zod type from a set of constraints.
// Returns undefined when the constraints do not specify a type.
function resolveElementSchema(
  cls: Constructor,
  prop: string,
  cs: CvConstraint[],
): z.ZodTypeAny | undefined {
  const types = new Set(cs.map(constraintKey));

  if (types.has(CV_NESTED)) {
    const meta = getTypeMeta(cls, prop);
    if (meta?.typeFunction) return DtoToZod(meta.typeFunction());
    return z.record(z.string(), z.unknown());
  }

  // if (types.has(CV_IS_IN)) return buildIsInSchema(cs);
  if (types.has(CV_IS_ENUM)) return buildEnumSchema(cs);

  const isStringLike =
    types.has(CV_IS_STRING) ||
    types.has(CV_IS_URL) ||
    types.has(CV_MAX_LENGTH) ||
    types.has(CV_MATCHES);
  if (isStringLike) return buildStringSchema(cs);

  if (types.has(CV_IS_BOOLEAN)) return z.boolean();
  if (types.has(CV_IS_NUMBER) || types.has(CV_IS_INT)) return z.number();

  return undefined;
}

// Falls back to @Type() metadata when element constraints are absent (e.g. array
// with only @Type(() => SomeClass) and @ValidateNested({ each: true }), or arrays
// of primitives decorated only with @Type(() => Number)).
function resolveElementFromTypeMeta(
  cls: Constructor,
  prop: string,
): z.ZodTypeAny | undefined {
  const meta = getTypeMeta(cls, prop);
  if (!meta?.typeFunction) return undefined;

  const ctor = meta.typeFunction();
  if (ctor === String) return z.string();
  if (ctor === Number) return z.number();
  if (ctor === Boolean) return z.boolean();
  return DtoToZod(ctor);
}

// Uses the `type` stored in @ApiProperty() metadata, which NestJS Swagger
// populates from design:type at decoration time. Handles constructor refs,
// lazy () => Class functions, and primitive string type names.
function resolveFromSwaggerType(type: unknown): z.ZodTypeAny | undefined {
  if (!type) return undefined;

  // Lazy type function: @ApiProperty({ type: () => SomeClass }) or factory type: () => X
  if (typeof type === 'function' && type.name === 'type') {
    return resolveFromSwaggerType((type as () => unknown)());
  }

  // Array notation [Constructor]: from _OPENAPI_METADATA_FACTORY type: () => [String]
  if (Array.isArray(type) && (type as unknown[]).length === 1) {
    const elem = resolveFromSwaggerType((type as unknown[])[0]);
    return z.array(elem ?? z.unknown());
  }

  if (type === String) return z.string();
  if (type === Boolean) return z.boolean();
  if (type === Number) return z.number();
  if (type === Array) return z.array(z.unknown());
  if (type === Object) return z.record(z.string(), z.unknown());

  // String type names (e.g. 'string', 'number', 'boolean') from explicit @ApiProperty({ type: 'string' })
  if (type === 'string') return z.string();
  if (type === 'number') return z.number();
  if (type === 'boolean') return z.boolean();
  if (type === 'integer') return z.number().int();

  // Class constructor — recurse
  if (typeof type === 'function') {
    try {
      return DtoToZod(type as Constructor);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function buildPropertySchema(
  cls: Constructor,
  prop: string,
  cs: CvConstraint[],
  apiMeta: ApiPropertyMeta | undefined,
  factoryMeta: FactoryPropertyMeta | undefined,
): z.ZodTypeAny {
  const ownCs = cs.filter((c) => !c.each);
  const ownTypes = new Set(ownCs.map(constraintKey));

  // Detect array from class-validator @IsArray() or from @ApiProperty({ isArray: true })
  const isArray = ownTypes.has(CV_IS_ARRAY) || apiMeta?.isArray === true;

  if (isArray) {
    const eachCs = cs.filter((c) => c.each);
    const elemSchema =
      resolveElementSchema(cls, prop, eachCs) ??
      resolveElementFromTypeMeta(cls, prop) ??
      z.unknown();
    return z.array(elemSchema);
  }

  return (
    resolveElementSchema(cls, prop, ownCs) ??
    resolveFromSwaggerType(apiMeta?.type) ??
    resolveFromSwaggerType(factoryMeta?.type) ??
    inferFromDesignType(getDesignType(cls, prop))
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────────────────

export function DtoToZod<T>(cls: Constructor<T>): z.ZodObject<DtoShape<T>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  const factoryAll = getClassFactoryMeta(cls);

  for (const prop of collectPropertyNames(cls)) {
    const cs = getConstraints(cls, prop);
    const apiMeta = getApiPropertyMeta(cls, prop);
    const factoryMeta = factoryAll[prop];

    // @IsOptional() registers as conditionalValidation; @ApiPropertyOptional()
    // / @ApiProperty({ required: false }) sets required: false on the swagger meta.
    // Factory required: false covers undecorated optional fields (plugin-generated).
    const isOptional =
      cs.some((c) => constraintKey(c) === CV_OPTIONAL) ||
      apiMeta?.required === false ||
      factoryMeta?.required === false;

    let schema = buildPropertySchema(cls, prop, cs, apiMeta, factoryMeta);

    if (isOptional) {
      schema = schema.optional();

      const defaultVal =
        apiMeta?.default ??
        factoryMeta?.default ??
        getInstanceDefault(cls, prop);
      if (defaultVal !== undefined) {
        schema = (schema as z.ZodOptional<z.ZodTypeAny>).default(defaultVal);
      }
    }

    const desc = apiMeta?.description ?? factoryMeta?.description;
    if (desc) schema = schema.describe(desc);

    shape[prop] = schema;
  }

  return z.object(shape) as unknown as z.ZodObject<DtoShape<T>>;
}
