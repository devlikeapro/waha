import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SessionManager } from '../abc/manager.abc';
import { MessageType, ScheduleMessageRequest } from './scheduler.dto';
import { SchedulerRepository } from './scheduler.repository';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private sessionManager: SessionManager,
    private repository: SchedulerRepository,
  ) {}

  async onModuleInit() {
      await this.repository.init();
      this.logger.log('Loading scheduled jobs from storage...');
      const jobs = await this.repository.getAll();
      let count = 0;
      for (const job of jobs) {
          const date = new Date(job.executeAt);
          if (date.getTime() < Date.now()) {
              this.logger.warn(`Job ${job.id} is in the past, executing immediately/soon (or ignoring?) - Deleting for now to avoid flood`);
              // For safety, let's delete expired jobs or execute them?
              // Simple approach: delete expired.
              await this.repository.delete(job.id);
          } else {
              this.scheduleJob(job, false); // Don't save again
              count++;
          }
      }
      this.logger.log(`Loaded ${count} jobs.`);
  }

  async schedule(request: ScheduleMessageRequest) {
    const date = new Date(request.executeAt);
    if (date.getTime() < Date.now()) {
        throw new Error('Date must be in the future');
    }
    
    // Save to DB first
    await this.repository.save(request);
    
    return this.scheduleJob(request, true);
  }

  private scheduleJob(request: ScheduleMessageRequest, isNew: boolean) {
    const date = new Date(request.executeAt);
    const jobName = request.id;

    // Check if job exists in registry (if we are reloading, it shouldn't, but good to check)
    try {
        if (this.schedulerRegistry.getCronJob(jobName)) {
            // specific error or just log
             if (isNew) throw new Error(`Job with ID ${jobName} already exists`);
             return; 
        }
    } catch (e) {
        // Not found, proceed
    }

    const job = new CronJob(date, async () => {
      this.logger.log(`Executing scheduled job ${jobName}`);
      try {
        const session = await this.sessionManager.getWorkingSession(request.payload.session);
        let result;
        switch (request.type) {
            case MessageType.TEXT:
                result = await session.sendText(request.payload);
                break;
            case MessageType.IMAGE:
                result = await session.sendImage(request.payload);
                break;
            case MessageType.FILE:
                result = await session.sendFile(request.payload);
                break;
            case MessageType.VOICE:
                result = await session.sendVoice(request.payload);
                break;
            case MessageType.VIDEO:
                result = await session.sendVideo(request.payload);
                break;
            default:
                this.logger.error(`Unknown message type: ${request.type}`);
        }
        if (result) {
            this.logger.log(`Job ${jobName} executed successfully. Result: ${JSON.stringify(result)}`);
        }
      } catch (e) {
        this.logger.error(`Failed to execute job ${jobName}`, e);
      } finally {
          try {
            this.schedulerRegistry.deleteCronJob(jobName);
            await this.repository.delete(jobName);
          } catch (e) {
              this.logger.error(`Failed to cleanup job ${jobName}`, e);
          }
      }
    });

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
    this.logger.log(`Scheduled job ${jobName} at ${date}`);
    return { status: 'scheduled', id: jobName, executeAt: date };
  }

  listJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const result = [];
    jobs.forEach((value, key) => {
        let next;
        try {
            // @ts-ignore
            next = value.nextDate().toJSDate();
        } catch (e) {
            next = 'finished';
        }
        result.push({ id: key, nextExecution: next });
    });
    return result;
  }
  
  async cancelJob(id: string) {
      try {
        this.schedulerRegistry.deleteCronJob(id);
      } catch (e) {
          // ignore
      }
      await this.repository.delete(id);
      return { status: 'cancelled', id };
  }
}
