/**
 * Events
 */
import { ApiProperty } from '@nestjs/swagger';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { IsNotEmpty, IsString } from 'class-validator';

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

  _data: any;
}

/**
 * Native (VoIP) calls — GOWS engine only
 */
export enum CallState {
  INITIATING = 'initiating',
  RINGING = 'ringing',
  INCOMING_RINGING = 'incoming_ringing',
  CONNECTING = 'connecting',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  ENDED = 'ended',
}

export enum CallDirection {
  OUTGOING = 'outgoing',
  INCOMING = 'incoming',
}

export class StartCallRequest {
  @ChatIdProperty()
  @IsString()
  @IsNotEmpty()
  chatId: string;
}

export class CallMediaRequest {
  @ApiProperty({
    description:
      'Browser WebRTC SDP offer. It must include a data channel labelled "pcm" ' +
      'carrying 16 kHz mono Int16 LE PCM in both directions. ' +
      'Wait for ICE gathering to complete before sending it (no trickle ICE).',
    example: 'v=0\r\no=- 46117 2 IN IP4 127.0.0.1\r\n...',
  })
  @IsString()
  @IsNotEmpty()
  sdp: string;
}

export class CallMediaResponse {
  @ApiProperty({
    description: 'SDP answer to apply with setRemoteDescription()',
  })
  sdp: string;
}

export class CallInfo {
  @CallIdProperty()
  id: string;

  @ApiProperty({
    description: 'The other party of the call',
    example: '11111111111@c.us',
  })
  peer: string;

  @ApiProperty({ enum: CallDirection })
  direction: CallDirection;

  @ApiProperty({ enum: CallState })
  state: CallState;

  isVideo: boolean;

  @ApiProperty({
    description: 'Why the call ended (only when state is "ended")',
    example: 'user_ended',
    required: false,
  })
  endReason?: string;

  @ApiProperty({
    description: 'True when a browser is attached to the call audio (WebRTC)',
  })
  mediaConnected: boolean;

  timestamp: number;
}
