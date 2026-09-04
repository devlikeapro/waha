import { TmpDir } from '@waha/utils/tmpdir';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from 'pino';
import { IMediaConverter } from '@waha/core/media/IMediaConverter';

function IsMP3(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 3) return false;

  // ID3 header: 0x49 0x44 0x33 = 'I', 'D', '3'
  const b0 = buffer[0]; // 0x49
  const b1 = buffer[1]; // 0x44
  const b2 = buffer[2]; // 0x33

  const isID3 = b0 === 0x49 && b1 === 0x44 && b2 === 0x33;

  // MPEG frame sync (frame starts with 0xFF Ex, e.g. FB, F3, F2)
  const isMPEGFrame = buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;

  return isID3 || isMPEGFrame;
}

interface ICommand {
  get input(): string | null;

  get output(): string | null;

  spawn(cwd: string, logger: Logger): Promise<void>;
}

class Command implements ICommand {
  private readonly bin: string;
  private args: string[];

  constructor(
    private command: string,
    public input: string = null,
    public output: string = null,
  ) {
    const parts = command.split(' ');
    this.bin = parts[0];
    this.args = parts.slice(1);
    this.checkArgs();
  }

  private checkArgs() {
    if (this.input && !this.args.includes(this.input)) {
      throw new Error(
        `Invalid command "${this.command}", must contain input "${this.input}"`,
      );
    }
    if (this.output && !this.args.includes(this.output)) {
      throw new Error(
        `Invalid command "${this.command}", must contain output "${this.output}"`,
      );
    }
  }

  public spawn(cwd: string | undefined, logger: Logger): Promise<void> {
    const args = this.args.slice();
    logger.debug(`Executing command: '${this.bin} ${args.join(' ')}'...`);
    return new Promise((resolve, reject) => {
      const command = spawn(this.bin, args, { cwd: cwd });
      command.stderr.on('data', (data) => {
        // command might output progress information to stderr
        logger.debug(`${this.bin}: ${data}`);
      });

      command.on('close', (code) => {
        logger.debug(`${this.bin} exited with code ${code}`);
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `${this.bin} process exited with code ${code}. Check logs to find the reason`,
            ),
          );
        }
      });

      command.on('error', (err) => {
        reject(
          new Error(`Failed to start ${this.bin} process: ${err.message}`),
        );
      });
    });
  }
}

class CommandPipe implements ICommand {
  constructor(private commands: ICommand[]) {}

  get input(): string {
    return this.commands[0].input;
  }

  get output(): string {
    return this.commands[this.commands.length - 1].output;
  }

  async spawn(cwd: string, logger: Logger): Promise<void> {
    for (const cmd of this.commands) {
      if (!cmd.input) {
        new Error(`Command in pipeline is missing input file specification`);
      }
      if (!cmd.output) {
        new Error(`Command in pipeline is missing output file specification`);
      }
      await cmd.spawn(cwd, logger);
    }
  }
}

function pipeline(...commands: ICommand[]): ICommand {
  return new CommandPipe(commands);
}

class Ffmpeg implements IMediaConverter {
  private readonly tmpdir: TmpDir;

  // Cleanup mp3 metadata and convert to wav
  // https://github.com/devlikeapro/waha/issues/1393
  private VoiceCleanupMp3 = new Command(
    'ffmpeg -hide_banner -loglevel error -nostdin -y -i input.mp3 -vn -sn -dn -map 0:a:0 -map_metadata -1 -ac 1 -ar 48000 -c:a pcm_s16le input.wav',
    'input.mp3',
    'input.wav',
  );
  // Convert wav to ogg opus with WhatsApp settings
  // $ ffprobe -hide_banner -v error -show_format -show_streams "output.opus"
  private VoiceConvertToOGG = new Command(
    'ffmpeg -hide_banner -loglevel error -nostdin -i input.wav -c:a libopus -b:a 32k -ar 48000 -ac 1 output.opus',
    'input.wav',
    'output.opus',
  );
  // Clean up opus tags that may reveal the encoder used
  // $ mediainfo "output.opus"
  private VoiceCleanOpustags = new Command(
    'opustags --in-place --delete ENCODER --delete encoder --set-vendor Recorder output.opus',
    'output.opus',
    'output.opus',
  );

  private OpustagsHelp = new Command('opustags --help');

  private WhatsAppVoice: ICommand;

  // Convert video to WhatsApp compatible mp4
  // TODO: Do we need to remove metadata as well?
  private WhatsAppVideo = new Command(
    'ffmpeg -hide_banner -loglevel error -nostdin -i input.mp4 -c:v libx264 -map 0 -pix_fmt yuv420p -vf scale=trunc(iw/2)*2:trunc(ih/2)*2 -movflags +faststart output.mp4',
    'input.mp4',
    'output.mp4',
  );

  constructor(
    session: string,
    private logger: Logger,
  ) {
    this.tmpdir = new TmpDir(logger, `waha-ffmpeg-${session}-`);
  }

  protected async process(cmd: ICommand, content: Buffer): Promise<Buffer> {
    return await this.tmpdir.use(async (dir) => {
      const inputFile = path.join(dir, cmd.input);
      const outputFile = path.join(dir, cmd.output);
      await fs.writeFile(inputFile, content);
      await cmd.spawn(dir, this.logger);
      return await fs.readFile(outputFile);
    });
  }

  /**
   * Process audio content to make it compatible with WhatsApp
   * @param content Audio buffer to process
   * @returns Processed audio buffer or original buffer if processing fails
   */
  public async voice(content: Buffer): Promise<Buffer> {
    if (!this.WhatsAppVoice) {
      try {
        // Test if opustags available
        await this.OpustagsHelp.spawn(undefined, this.logger);
        this.logger.debug(
          'opustags found, voice messages will have metadata cleaned',
        );
        this.WhatsAppVoice = pipeline(
          this.VoiceCleanupMp3,
          this.VoiceConvertToOGG,
          this.VoiceCleanOpustags,
        );
      } catch (e) {
        this.logger.warn(
          `opustags not found, voice messages will not have metadata cleaned: ${e.message}`,
        );
        this.WhatsAppVoice = pipeline(
          this.VoiceCleanupMp3,
          this.VoiceConvertToOGG,
        );
      }
    }
    return this.process(this.WhatsAppVoice, content);
  }

  /**
   * Process video content to make it compatible with WhatsApp
   * @param content Video buffer to process
   * @returns Processed video buffer or original buffer if processing fails
   */
  public async video(content: Buffer): Promise<Buffer> {
    return this.process(this.WhatsAppVideo, content);
  }
}

export { Ffmpeg };
