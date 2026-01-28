import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SessionManager } from '@waha/core/abc/manager.abc';
import { WAMimeType } from '@waha/core/media/WAMimeType';
import { ApiFileAcceptHeader } from '@waha/nestjs/ApiFileAcceptHeader';
import {
  SessionApiParam,
  WorkingSessionParam,
} from '@waha/nestjs/params/SessionApiParam';
import {
  FileDTO,
  VideoFileDTO,
  VoiceFileDTO,
} from '@waha/structures/media.dto';

import { WhatsappSession } from '../core/abc/session.abc';
import { BufferResponseInterceptor } from '../nestjs/BufferResponseInterceptor';
import { PoliciesGuard } from '@waha/core/auth/policies.guard';
import { CheckPolicies } from '@waha/core/auth/policies.decorator';
import { CanSession, FromParam } from '@waha/core/auth/policies';

import { Action } from '@waha/core/auth/casl.types';

@ApiSecurity('api_key')
@Controller('api/:session/media')
@ApiTags('🖼️ Media')
@UseGuards(PoliciesGuard)
@CheckPolicies(CanSession(Action.Use, FromParam('session')))
class MediaController {
  constructor(private manager: SessionManager) {}

  @Post('convert/voice')
  @ApiOperation({
    summary: 'Convert voice to WhatsApp format (opus)',
  })
  @SessionApiParam
  @UseInterceptors(
    new BufferResponseInterceptor(WAMimeType.VOICE, 'output.opus'),
  )
  @ApiFileAcceptHeader(WAMimeType.VOICE)
  async convertVoice(
    @WorkingSessionParam session: WhatsappSession,
    @Body() file: VoiceFileDTO,
  ): Promise<Buffer> {
    const data = await this.buffer(session, file);
    const content = await session.mediaConverter.voice(data);
    return content;
  }

  @Post('convert/video')
  @ApiOperation({
    summary: 'Convert video to WhatsApp format (mp4)',
  })
  @SessionApiParam
  @UseInterceptors(
    new BufferResponseInterceptor(WAMimeType.VIDEO, 'output.mp4'),
  )
  @ApiFileAcceptHeader(WAMimeType.VIDEO)
  async convertVideo(
    @WorkingSessionParam session: WhatsappSession,
    @Body() file: VideoFileDTO,
  ): Promise<Buffer> {
    const data = await this.buffer(session, file);
    const content = await session.mediaConverter.video(data);
    return content;
  }

  private async buffer(
    session: WhatsappSession,
    file: FileDTO,
  ): Promise<Buffer> {
    if ('url' in file) {
      return session.fetch(file.url);
    } else if ('data' in file) {
      return Buffer.from(file.data, 'base64');
    } else {
      throw new UnprocessableEntityException(
        'Either "url" or "data" must be specified.',
      );
    }
  }
}

export { MediaController };
