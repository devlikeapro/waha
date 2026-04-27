import { Tenant, TenantQuota } from './Tenant';

export interface TenantUsage {
  /** Number of active sessions */
  sessionsCount: number;
  /** Number of API keys */
  apiKeysCount: number;
  /** Media storage used in MB */
  mediaStorageMb: number;
  /** Number of concurrent running sessions */
  concurrentSessions: number;
}

export interface ITenantRepository {
  /** Initialize the repository */
  init(): Promise<void>;

  /** Create a new tenant */
  create(tenant: Tenant): Promise<Tenant>;

  /** Get tenant by ID */
  getById(id: string): Promise<Tenant | null>;

  /** Get tenant by name */
  getByName(name: string): Promise<Tenant | null>;

  /** Update an existing tenant */
  update(tenant: Tenant): Promise<Tenant>;

  /** Delete a tenant */
  delete(id: string): Promise<void>;

  /** List all tenants */
  list(): Promise<Tenant[]>;

  /** Get quota for a tenant */
  getQuota(tenantId: string): Promise<TenantQuota>;

  /** Update quota for a tenant */
  updateQuota(tenantId: string, quota: Partial<TenantQuota>): Promise<void>;

  /** Check if tenant can create more resources */
  checkQuota(tenantId: string): Promise<{ allowed: boolean; usage: TenantUsage }>;

  /** Enforce quota - throws if quota exceeded */
  enforceQuota(tenantId: string): Promise<void>;
}
