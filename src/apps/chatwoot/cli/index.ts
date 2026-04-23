import { CommanderError } from 'commander';
import { parse } from 'shell-quote';
import { BufferedOutput } from '@waha/apps/chatwoot/cli/utils/BufferedOutput';
import { CommandContext } from '@waha/apps/chatwoot/cli/types';
import { ChatWootCommandsConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { BuildProgram } from '@waha/apps/chatwoot/cli/program.a';
import { CHATWOOT_COMMAND_PREFIX } from '@waha/apps/chatwoot/env';

export async function runText(
  commands: ChatWootCommandsConfig,
  ctx: CommandContext,
  text: string,
) {
  // Prepare text for cli like command
  text = text
    .split('\n') // split into lines
    .map((line) => line.trimStart()) // remove indentation
    .join(' ') // join with space
    .trim(); // final cleanup
  // Strip WhatsApp/markdown formatting characters so shell-quote doesn't
  // treat them as glob operators and return non-string tokens
  text = text.replace(/[*_~`]/g, '');
  const output = new BufferedOutput();
  const program = BuildProgram(commands, ctx, output);
  const argv = parse(text);
  try {
    await program.parseAsync(argv, { from: 'user' });
  } catch (err) {
    if (err instanceof CommanderError) {
      return output;
    } else {
      throw err; // unexpected bug in your action code
    }
  }
  return output;
}

export const CommandPrefix = CHATWOOT_COMMAND_PREFIX;
