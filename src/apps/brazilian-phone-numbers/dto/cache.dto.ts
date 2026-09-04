import { ApiProperty } from '@nestjs/swagger';

export class BrazilianPhoneMemoryCacheEntry {
  @ApiProperty({
    description: 'Phone number digits the cache entry is keyed by',
  })
  key: string;

  @ApiProperty({
    description:
      'Resolved chat id. An empty string is a confirmed-negative - ' +
      'the number is verified NOT to exist on WhatsApp.',
  })
  chatId: string;

  @ApiProperty({
    description: 'When the entry expires; null when it has no TTL',
    nullable: true,
    type: Date,
  })
  expiresAt: Date | null;
}

export class BrazilianPhoneDbCacheEntry {
  @ApiProperty({
    description: 'Record id',
  })
  id: number;

  @ApiProperty({
    description: 'Phone number digits the cache entry is keyed by',
  })
  key: string;

  @ApiProperty({
    description: 'Resolved chat id',
  })
  chatId: string;

  @ApiProperty({
    description: 'Whether the resolution was verified against WhatsApp',
  })
  verified: boolean;

  @ApiProperty({
    description: 'When the number was resolved',
  })
  resolvedAt: Date;
}

export class BrazilianPhoneMemoryCacheStats {
  @ApiProperty({
    description: 'Number of entries in the in-memory cache',
  })
  total: number;
}

export class BrazilianPhoneDbCacheStats {
  @ApiProperty({
    description: 'Total number of entries in the persistent cache',
  })
  total: number;

  @ApiProperty({
    description: 'Number of entries verified against WhatsApp',
  })
  verified: number;
}

export class BrazilianPhoneCacheStatsResponse {
  @ApiProperty({
    description: 'In-memory cache stats; null when the session is not running',
    nullable: true,
    type: BrazilianPhoneMemoryCacheStats,
  })
  memory: BrazilianPhoneMemoryCacheStats | null;

  @ApiProperty({
    description:
      'Persistent cache stats; null when the persistent cache is disabled',
    nullable: true,
    type: BrazilianPhoneDbCacheStats,
  })
  db: BrazilianPhoneDbCacheStats | null;
}

export class BrazilianPhoneCachePurgeResponse {
  @ApiProperty({
    description: 'Number of entries removed from the persistent cache',
  })
  deleted: number;
}
