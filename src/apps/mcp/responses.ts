export function TextMcpResponse(text: string) {
  return { content: [{ type: 'text' as const, text: text }] };
}

export function JsonMcpToolResponse(value: unknown) {
  return TextMcpResponse(JSON.stringify(value));
}

export function ImageMcpResponse(buffer: Buffer) {
  return {
    content: [
      {
        type: 'image' as const,
        data: buffer.toString('base64'),
        mimeType: 'image/png',
      },
    ],
  };
}

export function JsonMcpResponse(uri: URL, data: any) {
  return {
    contents: [
      {
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(data),
      },
    ],
  };
}
