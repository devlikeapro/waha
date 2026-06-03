import { z } from 'zod';
import { WAHASelf } from '@waha/apps/app_sdk/waha/WAHASelf';
import { McpController } from '@waha/apps/mcp/decorators/controller';
import { Tool } from '@waha/apps/mcp/decorators/tool';
import {
  ProfileNameInput,
  ProfilePictureInput,
  ProfileSessionInput,
  ProfileStatusInput,
} from '@waha/apps/mcp/tools/profile.zod';

export class ProfileTools extends McpController {
  constructor(api: WAHASelf) {
    super(api);
  }

  @Tool('profile-get', {
    title: 'Get my profile',
    description:
      'Get the profile info (id, name, picture) for the session account',
    inputSchema: ProfileSessionInput,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async get({ session }: z.infer<typeof ProfileSessionInput>) {
    return this.textRequest({
      method: 'GET',
      url: `/api/${session}/profile`,
    });
  }

  @Tool('profile-set-name', {
    title: 'Set profile name',
    description: 'Update the display name for the session account',
    inputSchema: ProfileNameInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setName({ session, ...body }: z.infer<typeof ProfileNameInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/profile/name`,
      data: body,
    });
  }

  @Tool('profile-set-status', {
    title: 'Set profile status',
    description: 'Update the "About" / status text for the session account',
    inputSchema: ProfileStatusInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
  })
  async setStatus({ session, ...body }: z.infer<typeof ProfileStatusInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/profile/status`,
      data: body,
    });
  }

  @Tool('profile-set-picture', {
    title: 'Set profile picture',
    description: 'Update the profile picture for the session account',
    inputSchema: ProfilePictureInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
    },
  })
  async setPicture({ session, ...body }: z.infer<typeof ProfilePictureInput>) {
    return this.textRequest({
      method: 'PUT',
      url: `/api/${session}/profile/picture`,
      data: body,
    });
  }

  @Tool('profile-delete-picture', {
    title: 'Delete profile picture',
    description: 'Remove the profile picture for the session account',
    inputSchema: ProfileSessionInput,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
    },
  })
  async deletePicture({ session }: z.infer<typeof ProfileSessionInput>) {
    return this.textRequest({
      method: 'DELETE',
      url: `/api/${session}/profile/picture`,
    });
  }
}
