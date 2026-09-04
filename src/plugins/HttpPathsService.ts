import { Injectable } from '@nestjs/common';

/**
 * What the path takes part in.
 */
export interface HttpPathInclude {
  /** Log requests to the path in the HTTP access log (default true). */
  accessLog?: boolean;
  /** Protect the path with the global (Swagger) basic auth (default true). */
  authBasic?: boolean;
  /** Protect the route with the api key middleware (default false). */
  authApiKey?: boolean;
  /** Count requests to the path in the HTTP metrics (default true). */
  metrics?: boolean;
}

/**
 * A URL prefix contributed by a module - matched with url.startsWith(prefix);
 * for authApiKey the prefix is passed verbatim to MiddlewareConsumer.forRoutes().
 */
export interface HttpPathContribution {
  prefix: string;
  include?: HttpPathInclude;
}

/**
 * Collects HTTP path contributions from modules, so core auth, logging and metrics can honor them
 * without importing the modules.
 */
@Injectable()
export class HttpPathsService {
  private contributions: HttpPathContribution[] = [];

  register(...contributions: HttpPathContribution[]): void {
    this.contributions.push(...contributions);
  }

  isAccessLogIgnored(url: string): boolean {
    return this.contributions.some(
      (contribution) =>
        contribution.include?.accessLog === false &&
        url.startsWith(contribution.prefix),
    );
  }

  globalAuthExcludePrefixes(): string[] {
    return this.contributions
      .filter((contribution) => contribution.include?.authBasic === false)
      .map((contribution) => contribution.prefix);
  }

  isHttpMetricsIgnored(pathname: string): boolean {
    return this.contributions.some(
      (contribution) =>
        contribution.include?.metrics === false &&
        pathname.startsWith(contribution.prefix),
    );
  }

  apiKeyRoutes(): string[] {
    return this.contributions
      .filter((contribution) => contribution.include?.authApiKey === true)
      .map((contribution) => contribution.prefix);
  }
}
