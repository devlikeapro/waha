import { context, propagation } from '@opentelemetry/api';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { NodeSDK, NodeSDKConfiguration } from '@opentelemetry/sdk-node';
import { NoopSpanProcessor } from '@opentelemetry/sdk-trace';
import { VERSION } from '@waha/version';
import { NextFunction, Request, Response } from 'express';

process.env.OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'waha';
process.env.OTEL_METRICS_EXPORTER = process.env.OTEL_METRICS_EXPORTER || 'none';
process.env.OTEL_LOGS_EXPORTER = process.env.OTEL_LOGS_EXPORTER || 'none';
process.env.OTEL_TRACES_EXPORTER = process.env.OTEL_TRACES_EXPORTER || 'none';
process.env.OTEL_RESOURCE_ATTRIBUTES = getResourceAttributes();

function getResourceAttributes(): string {
  const attributes = [];
  if (process.env.OTEL_RESOURCE_ATTRIBUTES) {
    attributes.push(process.env.OTEL_RESOURCE_ATTRIBUTES);
  }
  attributes.push(`service.version=${VERSION.version}`);
  attributes.push(`service.engine=${VERSION.engine}`);
  attributes.push(`service.platform=${VERSION.platform}`);
  if (VERSION.browser) {
    attributes.push(`service.browser=${VERSION.browser}`);
  }
  if (VERSION.worker.id) {
    attributes.push(`worker.id=${VERSION.worker.id}`);
  }
  return attributes.join(',');
}

const OTelConfiguration: Partial<NodeSDKConfiguration> = {
  instrumentations: [
    new HttpInstrumentation({
      ignoreOutgoingRequestHook: () => true,
    }),
    new PinoInstrumentation({ disableLogSending: true }),
  ],
};

if (process.env.OTEL_TRACES_EXPORTER === 'none') {
  OTelConfiguration.spanProcessors = [new NoopSpanProcessor()];
}

new NodeSDK(OTelConfiguration).start();

/**
 * Injects trace context (traceparent header) to the client on every response
 */
export function injectTraceContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  propagation.inject(context.active(), res, {
    set: function setHeader(response: Response, key: string, value: string) {
      response.setHeader(key, value);
    },
  });
  next();
}
