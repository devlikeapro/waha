var parseIsSsrByDefault = () => !(typeof window !== 'undefined' && window.document && Boolean(window.document.createElement) && window.setTimeout);
export var Global = {
  devToolsEnabled: true,
  isSsr: parseIsSsrByDefault()
};