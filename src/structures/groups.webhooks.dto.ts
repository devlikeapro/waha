import { ApiProperty } from '@nestjs/swagger';
import { WAHAEvents } from '@waha/structures/enums.dto';
import {
  GroupV2JoinEvent,
  GroupV2LeaveEvent,
  GroupV2ParticipantsJoinRequestEvent,
  GroupV2ParticipantsEvent,
  GroupV2UpdateEvent,
} from '@waha/structures/groups.events.dto';
import { WAHAWebhook } from '@waha/structures/webhooks.dto';

export class WebhookGroupV2Join extends WAHAWebhook {
  @ApiProperty({
    description: 'When you joined or were added to a group',
  })
  event = WAHAEvents.GROUP_V2_JOIN;

  payload: GroupV2JoinEvent;
}

export class WebhookGroupV2Leave extends WAHAWebhook {
  @ApiProperty({
    description: 'When you left or were removed from a group',
  })
  event = WAHAEvents.GROUP_V2_LEAVE;

  payload: GroupV2LeaveEvent;
}

export class WebhookGroupV2Update extends WAHAWebhook {
  @ApiProperty({
    description: 'When group info is updated',
  })
  event = WAHAEvents.GROUP_V2_UPDATE;

  payload: GroupV2UpdateEvent;
}

export class WebhookGroupV2Participants extends WAHAWebhook {
  @ApiProperty({
    description: 'When participants changed - join, leave, promote to admin',
  })
  event = WAHAEvents.GROUP_V2_PARTICIPANTS;

  payload: GroupV2ParticipantsEvent;
}

export class WebhookGroupV2ParticipantsJoinRequest extends WAHAWebhook {
  @ApiProperty({
    description: 'When a user requests to join a group',
  })
  event = WAHAEvents.GROUP_V2_PARTICIPANTS_JOIN_REQUEST;

  payload: GroupV2ParticipantsJoinRequestEvent;
}
