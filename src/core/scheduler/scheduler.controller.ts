import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScheduleMessageRequest } from './scheduler.dto';
import { SchedulerService } from './scheduler.service';

@ApiTags('📤 Chatting')
@Controller('api/scheduler')
export class SchedulerController {
  constructor(private service: SchedulerService) {}

  @Post('/schedule')
  @ApiOperation({ summary: 'Schedule a message' })
  schedule(@Body() request: ScheduleMessageRequest) {
    return this.service.schedule(request);
  }

  @Get('/jobs')
  @ApiOperation({ summary: 'List scheduled jobs' })
  listJobs() {
    return this.service.listJobs();
  }

  @Get('/history')
  @ApiOperation({ summary: 'Get execution history of scheduled jobs' })
  getHistory() {
    return this.service.getHistory();
  }

  @Delete('/jobs/:id')
  @ApiOperation({ summary: 'Cancel a scheduled job' })
  cancelJob(@Param('id') id: string) {
    return this.service.cancelJob(id);
  }
}
