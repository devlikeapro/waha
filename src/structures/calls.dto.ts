/**
 * Events
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

function CallIdProperty() {
  return ApiProperty({
    description: 'Call ID',
    example: 'ABCDEFGABCDEFGABCDEFGABCDEFG',
  });
}

export class RejectCallRequest {
  @ChatIdProperty()
  @IsString()
  @IsNotEmpty()
  from: string;

  @CallIdProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CallData {
  @CallIdProperty()
  id: string;

  @ChatIdProperty()
  from?: string;

  timestamp: number;

  isVideo: boolean;

  isGroup: boolean;

  @ApiPropertyOptional({ example: 'inbound' })
  direction?: string;

  @ApiPropertyOptional({ example: 'active' })
  status?: string;

  @ApiPropertyOptional({ example: 'user_ended' })
  reason?: string;

  @ApiPropertyOptional({ example: 'call.active' })
  lifecycleEvent?: string;

  _data: any;
}

export class StartCallRequest {
  @ApiPropertyOptional({
    description: 'Phone number (digits only, without @c.us)',
    example: '5511999999999',
  })
  @ValidateIf((o) => !o.jid)
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Full WhatsApp JID',
    example: '5511999999999@s.whatsapp.net',
  })
  @ValidateIf((o) => !o.phone)
  @IsString()
  @IsNotEmpty()
  jid?: string;

  @ApiPropertyOptional({
    description: 'Start a video call (signaling only; audio via WebRTC)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  video?: boolean;
}

export class StartCallResponse {
  @CallIdProperty()
  call_id: string;
}

export class ExchangeCallWebRTCRequest {
  @ApiProperty({
    description: 'Browser WebRTC SDP offer',
  })
  @IsString()
  @IsNotEmpty()
  sdp_offer: string;
}

export class ExchangeCallWebRTCResponse {
  @ApiProperty({
    description: 'SDP answer to apply on RTCPeerConnection',
  })
  sdp_answer: string;
}

export class CallStateResponse {
  @ApiProperty()
  active: boolean;

  @CallIdProperty()
  call_id: string;

  @ChatIdProperty()
  from: string;

  @ApiProperty({ example: 'outbound' })
  direction: string;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ example: 'call.active' })
  event: string;
}
