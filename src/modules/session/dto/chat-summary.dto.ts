import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ChatKind } from '../../../engine/identity/wa-id';

const CHAT_KINDS: ChatKind[] = ['individual', 'group', 'channel', 'status', 'broadcast', 'unknown'];

/** OpenAPI mirror of the engine `ChatSummary` (documentation only; the runtime returns the interface). */
export class ChatSummaryDto {
  @ApiProperty({ example: '628111@c.us' })
  id!: string;

  @ApiProperty({ example: 'Alice' })
  name!: string;

  @ApiProperty({ description: 'Retained for back-compat; true for @g.us chats.', example: false })
  isGroup!: boolean;

  @ApiProperty({ enum: CHAT_KINDS, description: 'User-facing chat kind.', example: 'individual' })
  kind!: ChatKind;

  @ApiProperty({ example: 1 })
  unreadCount!: number;

  @ApiProperty({ description: 'Unix seconds of the last activity.', example: 1700000010 })
  timestamp!: number;

  @ApiPropertyOptional({ example: 'hi' })
  lastMessage?: string;

  @ApiPropertyOptional({ description: 'Whether the last message contains an image.', example: false })
  isImage?: boolean;

  @ApiProperty({ description: 'Archived state, as set via POST /sessions/{sessionId}/chats/archive.', example: false })
  archived!: boolean;

  @ApiProperty({ description: 'Pinned state, as set via POST /sessions/{sessionId}/chats/pin.', example: false })
  pinned!: boolean;

  @ApiProperty({
    description:
      'Whether the chat is muted right now, as set via POST /sessions/{sessionId}/chats/mute. The ' +
      'verdict rather than the expiry: whatsapp-web.js derives it itself from Chat.isMuted, and ' +
      'Baileys carries a muteEndTime that this gateway compares against now. muteExpiration carries ' +
      'the instant itself.',
    example: false,
  })
  muted!: boolean;

  @ApiPropertyOptional({
    description:
      'Epoch MILLISECONDS at which the mute ends, present only when muted is true; 0 means muted ' +
      'indefinitely. Milliseconds is the same unit as POST /sessions/{sessionId}/chats/mute ' +
      'muteUntil, so a finite value can be written straight back. The 0 an indefinite mute reports ' +
      'is the exception: muteUntil requires a real future instant, so re-apply an indefinite mute ' +
      'with a far-future timestamp rather than 0.',
    example: 1786003600000,
  })
  muteExpiration?: number;
}