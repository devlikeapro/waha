export const tokenize = translation => {
  const tokens = [];
  let position = 0;
  let currentText = '';
  const flushText = () => {
    if (currentText) {
      tokens.push({
        type: 'Text',
        value: currentText,
        position: position - currentText.length
      });
      currentText = '';
    }
  };
  while (position < translation.length) {
    const char = translation[position];
    if (char === '<') {
      const tagMatch = translation.slice(position).match(/^<(\d+)>/);
      if (tagMatch) {
        flushText();
        tokens.push({
          type: 'TagOpen',
          value: tagMatch[0],
          position,
          tagNumber: parseInt(tagMatch[1], 10)
        });
        position += tagMatch[0].length;
      } else {
        const closeTagMatch = translation.slice(position).match(/^<\/(\d+)>/);
        if (closeTagMatch) {
          flushText();
          tokens.push({
            type: 'TagClose',
            value: closeTagMatch[0],
            position,
            tagNumber: parseInt(closeTagMatch[1], 10)
          });
          position += closeTagMatch[0].length;
        } else {
          currentText += char;
          position += 1;
        }
      }
    } else {
      currentText += char;
      position += 1;
    }
  }
  flushText();
  return tokens;
};