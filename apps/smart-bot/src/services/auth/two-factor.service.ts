import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { WahaClientService } from '../waha-client.service';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
// import * as nodemailer from 'nodemailer';

@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name);
  // private readonly transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => WahaClientService)) private wahaClient: WahaClientService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
      /* 
      // COMMENTED OUT FOR FUTURE USE (OTP FLOW)
      // 2. Init SMTP
      const smtpHost = this.configService.get<string>('SMTP_HOST');
      const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const smtpPass = this.configService.get<string>('SMTP_PASS');

      if (smtpHost && smtpUser && smtpPass) {
          this.transporter = nodemailer.createTransport({
              host: smtpHost,
              port: smtpPort,
              secure: smtpPort === 465, // true for 465, false for other ports
              auth: {
                  user: smtpUser,
                  pass: smtpPass,
              },
          });
          this.logger.log(`SMTP configured for ${smtpUser}@${smtpHost}`);
      } else {
          this.logger.warn('SMTP not configured! Emails will NOT be sent. Set SMTP_HOST, SMTP_USER, SMTP_PASS.');
      }
      */
  }

  // --- ADMIN APPROVAL FLOW ---

  isAdmin(userId: string): boolean {
      const adminPhone = this.configService.get<string>('ADMIN_PHONE');
      if (!adminPhone) return false;

      // Normalize userId: remove suffix and ensure clean number
      const userPhone = userId.replace('@s.whatsapp.net', '').replace('@c.us', '');
      
      // Strict equality check
      return userPhone === adminPhone;
  }

  async requestAccess(userId: string, email: string, session: string): Promise<void> {
      // Store pending request
      await this.redis.set(`access:pending:${userId}`, email);
      this.logger.log(`User ${userId} requested access with email ${email}`);

      // Notify Admin
      const adminPhone = this.configService.get<string>('ADMIN_PHONE');
      if (adminPhone) {
          const adminId = adminPhone.includes('@') ? adminPhone : `${adminPhone}@s.whatsapp.net`;
          await this.wahaClient.sendText(
              session, 
              adminId, 
              `🔔 *New Access Request*\nUser: ${userId}\nEmail: ${email}\n\nTo approve, reply:\n/admin approve ${userId.replace('@s.whatsapp.net', '')}`
          );
      }
  }

  async approveUser(targetPhone: string): Promise<boolean> {
      // Clean the phone number to ensure it matches the key format if needed
      // Assuming admin sends raw number or full ID.
      
      // Store as verified permanently (no expiry)
      await this.redis.set(`2fa:verified:${targetPhone}`, 'true');
      await this.redis.del(`access:pending:${targetPhone}`);
      
      this.logger.log(`Admin approved user ${targetPhone}`);
      return true;
  }

  async isVerified(userId: string): Promise<boolean> {
    const isVerified = await this.redis.get(`2fa:verified:${userId}`);
    return isVerified === 'true' || this.isAdmin(userId);
  }

  /*
  // COMMENTED OUT OTP METHODS
  async requestCode(userId: string, email: string): Promise<boolean> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with 10 minute expiry
    await this.redis.set(`2fa:code:${userId}`, code, 'EX', 600);
    
    // Send Email
    if (this.transporter) {
        try {
            await this.transporter.sendMail({
                from: '"Smart Bot" <no-reply@waha.dev>',
                to: email,
                subject: 'Your Authentication Code',
                text: `Your code is: ${code}. It expires in 10 minutes.`,
            });
            this.logger.log(`Sent code to ${email}`);
            return true;
        } catch (e) {
            this.logger.error('Failed to send email', e);
            return false;
        }
    } else {
        this.logger.warn(`[DEV MODE] Code for ${userId}: ${code}`);
        return true;
    }
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const storedCode = await this.redis.get(`2fa:code:${userId}`);
    
    if (storedCode && storedCode === code) {
      await this.redis.del(`2fa:code:${userId}`); // One-time use
      // Mark verified for 30 days
      await this.redis.set(`2fa:verified:${userId}`, 'true', 'EX', 30 * 24 * 60 * 60); 
      return true;
    }
    return false;
  }
  */
}
