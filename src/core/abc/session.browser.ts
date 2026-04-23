import * as fs from 'fs';

//
// Browser executable path detection
//

// Ordered: Chrome paths first, then Chromium.
// Windows: only global Program Files paths (no per-user %LOCALAPPDATA%).
const BROWSER_PATHS: Record<string, string[]> = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Chromium\\Application\\chrome.exe',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ],
};

export function getBrowserExecutablePath(): string {
  const paths = BROWSER_PATHS[process.platform] ?? BROWSER_PATHS['linux'];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return paths[0];
}

// A path belongs to Google Chrome when it contains "google" in any casing.
// All Chrome paths include "Google" (macOS/Windows) or "google-chrome" (Linux),
// while Chromium paths never do.
export function isChromeExecutablePath(executablePath: string): boolean {
  return executablePath.toLowerCase().includes('google');
}
