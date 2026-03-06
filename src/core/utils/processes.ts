import { execSync } from 'child_process';
import * as fs from 'fs';

interface Logger {
  debug: (obj: object, msg?: string) => void;
}

/**
 * Finds and kills all processes whose command line contains ALL of the given
 * patterns (AND logic). Never throws — errors are swallowed or logged.
 */
export async function killProcessesByPatterns(
  patterns: string[],
  signal: NodeJS.Signals = 'SIGKILL',
  logger?: Logger,
): Promise<void> {
  try {
    const pids = findMatchingPids(patterns);
    for (const pid of pids) {
      try {
        killProcess(pid, signal);
        logger?.debug(
          { pid: pid, patterns: patterns, signal: signal },
          'Sent signal to process',
        );
      } catch (err) {
        logger?.debug(
          { pid: pid, err: err },
          'Failed to send signal to process',
        );
      }
    }
  } catch (err) {
    logger?.debug({ err: err }, 'Error while killing processes');
  }
}

function killProcess(pid: number, signal: NodeJS.Signals): void {
  if (process.platform === 'win32') {
    execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
  } else {
    process.kill(pid, signal);
  }
}

function matchesAll(cmdline: string, patterns: string[]): boolean {
  return patterns.every((p) => cmdline.includes(p));
}

function findMatchingPids(patterns: string[]): number[] {
  switch (process.platform) {
    case 'linux':
      return findMatchingPidsLinux(patterns);
    case 'darwin':
      return findMatchingPidsDarwin(patterns);
    case 'win32':
      return findMatchingPidsWindows(patterns);
    default:
      return [];
  }
}

function findMatchingPidsLinux(patterns: string[]): number[] {
  const pids: number[] = [];
  let entries: string[];
  try {
    entries = fs.readdirSync('/proc');
  } catch {
    return pids;
  }
  for (const entry of entries) {
    const pid = parseInt(entry, 10);
    if (isNaN(pid)) continue;
    try {
      // /proc/$pid/cmdline args are null-separated on Linux
      const cmdline = fs
        .readFileSync(`/proc/${pid}/cmdline`, 'latin1')
        .split('\0')
        .join(' ');
      if (matchesAll(cmdline, patterns)) {
        pids.push(pid);
      }
    } catch {
      // process may have already exited
    }
  }
  return pids;
}

function findMatchingPidsDarwin(patterns: string[]): number[] {
  const pids: number[] = [];
  try {
    const output = execSync('ps -eo pid= -o args=', { encoding: 'utf8' });
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const space = trimmed.indexOf(' ');
      if (space === -1) continue;
      const pid = parseInt(trimmed.slice(0, space), 10);
      const cmdline = trimmed.slice(space + 1);
      if (!isNaN(pid) && matchesAll(cmdline, patterns)) {
        pids.push(pid);
      }
    }
  } catch {
    // ps not available or failed
  }
  return pids;
}

function findMatchingPidsWindows(patterns: string[]): number[] {
  const pids: number[] = [];
  try {
    // Use EncodedCommand to avoid shell quoting issues
    const script =
      'Get-CimInstance Win32_Process | ForEach-Object { ($_.ProcessId).ToString() + " " + $_.CommandLine }';
    const encoded = Buffer.from(script, 'utf16le').toString('base64');
    const output = execSync(
      `powershell -NoProfile -EncodedCommand ${encoded}`,
      {
        encoding: 'utf8',
      },
    );
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const space = trimmed.indexOf(' ');
      if (space === -1) continue;
      const pid = parseInt(trimmed.slice(0, space), 10);
      const cmdline = trimmed.slice(space + 1);
      if (!isNaN(pid) && matchesAll(cmdline, patterns)) {
        pids.push(pid);
      }
    }
  } catch {
    // powershell not available or failed
  }
  return pids;
}
