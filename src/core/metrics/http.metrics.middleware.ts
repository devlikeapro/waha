import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { isMetricsPath } from '@waha/core/metrics/prometheus.registry';
import { WahaMetrics } from '@waha/core/metrics/waha.metrics';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: WahaMetrics) {}

  use(req: Request, res: Response, next: NextFunction): void {
    if (!this.metrics.isEnabled) {
      next();
      return;
    }
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const path = req.path || req.url || '';
      if (isMetricsPath(path)) {
        return;
      }
      const end = process.hrtime.bigint();
      const durationSeconds = Number(end - start) / 1e9;
      this.metrics.observeHttpRequest(req.method, res.statusCode, durationSeconds);
    });
    next();
  }
}
