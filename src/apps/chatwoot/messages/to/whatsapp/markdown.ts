export function MarkdownToWhatsApp(text: string): string {
  if (!text) {
    return '';
  }
  return (
    text
      // Normalize escaped newlines: \\\n, \\\\\n, etc. → \n
      // Fixes issue where ChatWoot sends escaped newlines incorrectly
      // Matches: two or more backslashes followed by n
      // Pattern breakdown:
      //   - (\\\\){1,} matches even numbers: 1+ pairs = 2, 4, 6... backslashes (minimum 2)
      //   - \\(\\\\)+ matches odd numbers: 1 + 1+ pairs = 3, 5, 7... backslashes (minimum 3)
      // Together they cover all cases of 2+ backslashes, excluding single \n (legitimate newline)
      .replace(/((\\\\){1,}|\\(\\\\)+)n/g, '\n')
      // Triple-backtick blocks → WhatsApp monospace blocks (same syntax)
      .replace(/```([\s\S]*?)```/g, '```$1```')
      // Italic **first**, but only single‐star or single‐underscore
      //    (?<!\*)\*(?!\*)  = a '*' not part of '**'
      //    (?<!_)_(?!_)      = a '_' not part of '__'
      .replace(
        /(?<!\*)\*(?!\*)(.*?)\*(?!\*)|(?<!_)_(?!_)(.*?)_(?!_)/g,
        (_m, a, b) => `_${a || b}_`,
      )
      // Bold: **bold** → *bold*
      .replace(/\*\*(.*?)\*\*/g, '*$1*')
      // Strikethrough: ~~strike~~ → ~strike~
      .replace(/~~(.*?)~~/g, '~$1~')
      // Links: [text](url) → text (url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)')
      // Lists: -, +, * → * item
      .replace(/^[-+*] (.*)/gm, '* $1')
  );
}
