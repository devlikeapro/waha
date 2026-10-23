import { BadRequestException } from '@nestjs/common';
import { spawnSync } from 'child_process';
import { Command } from 'commander';
import { BuildProgram } from '@waha/apps/chatwoot/cli/program.a';
import { CommandContext } from '@waha/apps/chatwoot/cli/types';
import { ChatWootCommandsConfig } from '@waha/apps/chatwoot/dto/config.dto';
import { runText } from '@waha/apps/chatwoot/cli/index';

jest.mock('@waha/apps/chatwoot/cli/program.a', () => ({
  BuildProgram: jest.fn(),
}));

describe('ChatWoot text commands', () => {
  let messages: string[];

  beforeEach(() => {
    messages = [];
    (BuildProgram as jest.Mock).mockImplementation((commands, ctx, output) => {
      const program = new Command().exitOverride().configureOutput(output);
      program.command('say <message>').action((message: string) => {
        messages.push(message);
      });
      return program;
    });
  });

  async function run(text: string) {
    return runText({} as ChatWootCommandsConfig, {} as CommandContext, text);
  }

  it('preserves quoted arguments and existing markdown normalization', async () => {
    await run('*say* "hello world"');
    expect(messages).toEqual(['hello world']);
  });

  it('normalizes multiline commands', async () => {
    await run('say\n  "hello world"');
    expect(messages).toEqual(['hello world']);
  });

  it.each([
    'say hello; say bye',
    'say hello | say bye',
    'say hello > output',
    'say hello # comment',
  ])(
    'rejects non-string shell tokens before executing: %s',
    async (text: string) => {
      await expect(run(text)).rejects.toBeInstanceOf(BadRequestException);
      expect(messages).toEqual([]);
    },
  );

  it('accepts shell punctuation inside a quoted argument', async () => {
    await run('say "hello; world | #"');
    expect(messages).toEqual(['hello; world | #']);
  });

  it('keeps Commander usage errors in the buffered response', async () => {
    const output = await run('say');
    expect(output.err).toContain('missing required argument');
    expect(messages).toEqual([]);
  });

  it('parses a large token list without quadratic event-loop blocking', () => {
    // Run the public CVE-2026-13311 regression shape in a child process so a
    // dependency regression cannot hang the Jest worker itself.
    const result = spawnSync(
      process.execPath,
      [
        '-e',
        "const { parse } = require(process.argv[1]); process.stdout.write(String(parse('x '.repeat(128000)).length));",
        require.resolve('shell-quote'),
      ],
      { encoding: 'utf8', timeout: 5000 },
    );
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('128000');
  });
});
