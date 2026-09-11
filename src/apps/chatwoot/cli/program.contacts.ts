import { Argument, Command, Option } from 'commander';
import { CommandContext } from '@waha/apps/chatwoot/cli/types';
import {
  JobAttemptsOption,
  JobTimeoutOption,
  ParseMS,
  NotNegativeNumber,
  ProgressOption,
} from '@waha/apps/chatwoot/cli/utils/options';
import {
  ContactsPullStart,
  ContactsPullStatus,
} from '@waha/apps/chatwoot/cli/cmd.contacts';
import { ContactsPullOptions } from '@waha/apps/chatwoot/consumers/task/contacts.pull';
import { JobsOptions } from 'bullmq';
import { JobDataTimeout } from '@waha/apps/app_sdk/AppConsumer';
import { NameUpdateMode } from '@waha/apps/chatwoot/client/ContactService';

export function AddContactsCommand(program: Command, ctx: CommandContext) {
  const l = ctx.l;
  const SyncGroup = l.r('cli.cmd.root.sub.sync');
  program.commandsGroup(SyncGroup);

  program
    .command('contacts')
    .summary(l.r('cli.cmd.contacts.summary'))
    .description(l.r('cli.cmd.contacts.description'))
    .helpGroup(SyncGroup)
    .addArgument(
      new Argument(
        '[action]',
        l.r('cli.cmd.contacts.action.description'),
      ).choices(['pull', 'status', 'help']),
    )
    .addOption(
      new Option(
        '-a, --avatar <mode>',
        l.r('cli.cmd.contacts.pull.option.avatar'),
      )
        .choices(['if-missing', 'update'])
        .preset('if-missing'),
    )
    .addOption(
      new Option(
        '-n, --update-names <mode>',
        l.r('cli.cmd.contacts.pull.option.update-names'),
      )
        .choices(Object.values(NameUpdateMode))
        .default(NameUpdateMode.NO),
    )
    .option('-g, --groups', l.r('cli.cmd.contacts.pull.option.groups'))
    .option('-l, --lids', l.r('cli.cmd.contacts.pull.option.lids'))
    .option(
      '--na, --no-attributes',
      l.r('cli.cmd.contacts.pull.option.no-attributes'),
    )
    .option(
      '-b, --batch <number>',
      l.r('cli.cmd.contacts.pull.option.batch'),
      NotNegativeNumber,
      100,
    )
    .addOption(
      ProgressOption(l.r('cli.cmd.contacts.pull.option.progress'), 100),
    )
    .addOption(new JobAttemptsOption(l, 6))
    .addOption(new JobTimeoutOption(l, '10m'))
    .addOption(
      new Option(
        '--dc, --delay-contact <duration>',
        l.r('cli.cmd.contacts.pull.option.delay-contact'),
      )
        .argParser(ParseMS)
        .default(ParseMS('0.1s'), '0.1s'),
    )
    .addOption(
      new Option(
        '--db, --delay-batch <duration>',
        l.r('cli.cmd.contacts.pull.option.delay-batch'),
      )
        .argParser(ParseMS)
        .default(ParseMS('1s'), '1s'),
    )
    .action(async (action, opts, cmd: Command) => {
      if (!action) {
        cmd.outputHelp();
        return;
      }

      if (action === 'help') {
        cmd.outputHelp();
        return;
      }

      if (action === 'status') {
        await ContactsPullStatus(ctx);
        return;
      }

      const options: ContactsPullOptions = {
        batch: opts.batch,
        progress: opts.progress,
        avatar: opts.avatar,
        updateNames: opts.updateNames,
        attributes: opts.attributes,
        contacts: {
          lids: opts.lids,
          groups: opts.groups,
        },
        delay: {
          contact: opts.delayContact,
          batch: opts.delayBatch,
        },
      };
      const jobOptions: JobsOptions & JobDataTimeout = {
        attempts: opts.attempts,
        timeout: {
          job: opts.timeout,
        },
      };
      await ContactsPullStart(ctx, options, jobOptions);
    });
}
