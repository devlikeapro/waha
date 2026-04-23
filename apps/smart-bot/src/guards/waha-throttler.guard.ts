import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class WahaThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // 1. Check if it's a WAHA webhook
    if (req.body && req.body.payload && req.body.payload.from) {
        // Limit based on the Sender ID (Phone Number)
        return req.body.payload.from;
    }
    
    // 2. Fallback to IP for other endpoints (e.g. /health)
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
