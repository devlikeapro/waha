import { WAHAEngine } from '@waha/structures/enums.dto';
import { WebhookConfig } from '@waha/structures/webhooks.config.dto';

export interface TenantQuota {
  /** Maximum number of sessions per tenant */
  maxSessions: number;
  /** Maximum number of API keys per tenant */
  maxApiKeys: number;
  /** Maximum media storage in MB */
  maxMediaStorageMb: number;
  /** Maximum concurrent running sessions */
  maxConcurrentSessions: number;
}

export interface TenantSettings {
  /** Override default engine for this tenant */
  defaultEngine?: WAHAEngine;
  /** Whitelist of engines allowed for this tenant */
  allowedEngines?: WAHAEngine[];
  /** Fallback webhook for tenant's sessions */
  webhookFallback?: WebhookConfig;
}

export interface Tenant {
  /** Unique tenant identifier */
  id: string;
  /** Human-readable tenant name */
  name: string;
  /** Whether tenant is active */
  isActive: boolean;
  /** Quota limits for this tenant */
  quota: TenantQuota;
  /** Tenant-specific settings */
  settings: TenantSettings;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/** Default quota for new tenants */
export const DEFAULT_TENANT_QUOTA: TenantQuota = {
  maxSessions: 10,
  maxApiKeys: 5,
  maxMediaStorageMb: 1024, // 1GB
  maxConcurrentSessions: 5,
};

/** Default tenant settings */
export const DEFAULT_TENANT_SETTINGS: TenantSettings = {};
