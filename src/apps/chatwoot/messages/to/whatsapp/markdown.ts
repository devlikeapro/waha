export function MarkdownToWhatsApp(text: string): string {
  if (!text) {
    return '';
  }
  return (
    text
      // Remove trailing backslash before newlines (ChatWoot v4.10.1+ escaping)
      .replace(/\\\n/g, '\n')
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
