import { Injectable, NestMiddleware } from '@nestjs/common';
import { WahaMetrics } from '@waha/modules/waha-prometheus/prometheus.metrics';
import { HttpPathsService } from '@waha/plugins/HttpPathsService';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(
    private metrics: WahaMetrics,
    private httpPaths: HttpPathsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const pathname = (req.originalUrl || req.url || '').split('?')[0];
    if (this.httpPaths.isHttpMetricsIgnored(pathname)) {
      next();
      return;
    }
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
      this.metrics.observeHttpRequest(
        req.method,
        res.statusCode,
        durationSeconds,
      );
    });
    next();
  }
}
