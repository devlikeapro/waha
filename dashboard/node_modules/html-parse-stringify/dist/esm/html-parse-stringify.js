// inlined from the former `void-elements` dependency, so the package has
// zero runtime dependencies. `!doctype`/`!DOCTYPE` are treated as void so a
// doctype parses as a childless node instead of swallowing the document.
const voidElements = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
  '!doctype': true,
  '!DOCTYPE': true,
};

const attrRE = /\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?("[^"]*"|'[^']*')/g;

function parseTag(tag) {
  const res = {
    type: 'tag',
    name: '',
    voidElement: false,
    attrs: {},
    children: [],
  };

  const tagMatch = tag.match(/<\/?([^\s]+?)[/\s>]/);
  if (tagMatch) {
    res.name = tagMatch[1];
    // void-element lookup stays case sensitive on purpose: react-i18next
    // relies on `<Br>` NOT being treated as a void `<br>` (see 1df0f9d)
    if (voidElements[tagMatch[1]] || tag.charAt(tag.length - 2) === '/') {
      res.voidElement = true;
    }

    // handle comment tag
    if (res.name.startsWith('!--')) {
      const endIndex = tag.indexOf('-->');
      return {
        type: 'comment',
        comment: endIndex !== -1 ? tag.slice(4, endIndex) : '',
      }
    }
  }

  const reg = new RegExp(attrRE);
  let result = null;
  for (;;) {
    result = reg.exec(tag);

    if (result === null) {
      break
    }

    if (!result[0].trim()) {
      continue
    }

    if (result[1]) {
      const attr = result[1].trim();
      // boolean attributes carry `null` so stringify can render them bare
      // (`<input disabled/>` instead of `<input disabled=""/>`)
      let arr = [attr, null];

      const eq = attr.indexOf('=');
      if (eq > -1) {
        // split at the first `=` only, so `data-x=a=b` keeps its full value
        arr = [attr.slice(0, eq), attr.slice(eq + 1)];
      }

      res.attrs[arr[0]] = arr[1];
      reg.lastIndex--;
    } else if (result[2]) {
      res.attrs[result[2]] = result[3].trim().substring(1, result[3].length - 1);
    }
  }

  return res
}

// comments are matched as a whole (so `>` inside them is fine), everything
// else tag-shaped is matched by the second alternative
const tagRE = /<!--[\s\S]*?-->|<[a-zA-Z0-9\-!/](?:"[^"]*"|'[^']*'|[^'">])*>/g;
const tagNameRE = /<\/?([^\s]+?)[/\s>]/;
const whitespaceRE = /^\s*$/;
// tags whose content is raw text: nothing inside them is markup
const rawTextRE = /^(script|style)$/i;

// placeholder for `<` of tags rejected by options.allowedTags; restored to a
// literal `<` in text/attr/comment content after parsing (U+0000 cannot appear
// in sane input, and a collision would merely render as an extra `<`)
const sentinel = '\u0000';

// re-used obj for quick lookups of components
const empty = Object.create(null);

function restoreSentinels(nodes) {
  nodes.forEach(function (node) {
    if (node.type === 'text') {
      node.content = node.content.split(sentinel).join('<');
      return
    }
    if (node.type === 'comment') {
      node.comment = node.comment.split(sentinel).join('<');
      return
    }
    for (const key in node.attrs) {
      const value = node.attrs[key];
      if (typeof value === 'string' && value.indexOf(sentinel) > -1) {
        node.attrs[key] = value.split(sentinel).join('<');
      }
    }
    if (node.children.length) {
      restoreSentinels(node.children);
    }
  });
}

function parse(html, options) {
  const components = (options && options.components) || empty;
  const allowedTags = options && options.allowedTags;
  let restoreNeeded = false;
  if (allowedTags) {
    const isAllowed =
      typeof allowedTags === 'function'
        ? allowedTags
        : function (name) {
            return allowedTags.indexOf(name) > -1
          };
    // neutralize tags whose name is not allowed, so they parse as text.
    // on a disallowed match only the leading `<` is escaped and scanning
    // resumes right after it, so a valid tag glued into the same match
    // (e.g. `<bold>` inside `<10, <20, and <bold>`) still gets recognized
    let out = '';
    let pos = 0;
    tagRE.lastIndex = 0;
    let am;
    while ((am = tagRE.exec(html))) {
      const tag = am[0];
      out += html.slice(pos, am.index);
      const nameMatch = tag.match(tagNameRE);
      if (tag.startsWith('<!--') || (nameMatch && isAllowed(nameMatch[1]))) {
        out += tag;
        pos = am.index + tag.length;
      } else {
        restoreNeeded = true;
        out += sentinel;
        pos = am.index + 1;
        tagRE.lastIndex = pos;
      }
    }
    html = out + html.slice(pos);
  }
  const result = [];
  const arr = [];
  let current;
  let level = -1;
  let inComponent = false;
  // while parsing raw-text content (script/style), tag-looking matches
  // before this index belong to the content and must be skipped
  let rawUntil = 0;
  // lazily created lowercase copy for case-insensitive raw-text close-tag search
  let htmlLower;

  // handle text at top level
  if (html.indexOf('<') !== 0) {
    const end = html.indexOf('<');
    result.push({
      type: 'text',
      content: end === -1 ? html : html.substring(0, end),
    });
  }

  // collect matches with an exec loop instead of matchAll to keep ES5 API compat
  const matches = [];
  let m;
  while ((m = tagRE.exec(html))) {
    matches.push(m);
  }
  matches.forEach(function (match, i) {
    const tag = match[0];
    if (!tag) return
    // comments match as a whole; their content must not trigger the
    // mismatched-bracket split below
    if (tag.startsWith('<!--')) return
    // count brackets outside quoted attribute values, so `<` inside an
    // attribute (e.g. title="1 < 2") can't trigger a bogus split
    let lts = 0;
    let gts = 0;
    let secondLt = -1;
    let quote = null;
    for (let j = 0; j < tag.length; j++) {
      const c = tag.charAt(j);
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === '<') {
        lts++;
        if (lts === 2) secondLt = j;
      } else if (c === '>') {
        gts++;
      }
    }
    // only split when the remainder is itself a valid tag start; otherwise
    // a fragment like `< <!-->` desyncs the string-level isComment check
    // from parseTag's name-based comment detection and crashes the walker
    const validSplit =
      secondLt > -1 && /[a-zA-Z0-9\-!/]/.test(tag.charAt(secondLt + 1));
    if (lts > gts && validSplit) {
      const firstPart = tag.substring(0, secondLt);
      const secondPart = tag.substring(firstPart.length);
      matches[i][0] = secondPart;
      matches[i].index += firstPart.length;
    }
  });
  matches.forEach(function (match, i) {
    const tag = match[0];
    if (!tag) return
    const index = match.index;
    if (index < rawUntil) return
    if (inComponent) {
      if (tag !== '</' + current.name + '>') {
        return
      } else {
        inComponent = false;
      }
    }
    const isOpen = tag.charAt(1) !== '/';
    const isComment = tag.startsWith('<!--');
    const start = index + tag.length;
    const nextChar = html.charAt(start);
    const nextMatch = matches[i + 1];
    let isText;
    if (nextChar === '<' && nextMatch) {
      const nextTag = html.substring(start, nextMatch.index);
      isText = nextTag.split('<').length > nextTag.split('>').length;
    }

    let parent;

    if (isComment) {
      const comment = parseTag(tag);

      // if we're at root, push new base node
      if (level < 0) {
        result.push(comment);
        return result
      }
      parent = arr[level];
      parent.children.push(comment);

      const text = html.slice(start, nextMatch ? nextMatch.index : undefined);
      if (text.length > 0) {
        parent.children.push({
          type: 'text',
          content: text,
        });
      }
      return result
    }

    if (isOpen) {
      level++;

      current = parseTag(tag);
      if (current.type === 'tag' && components[current.name]) {
        current.type = 'component';
        inComponent = true;
      }

      let isRawText = false;
      if (
        !inComponent &&
        !current.voidElement &&
        rawTextRE.test(current.name)
      ) {
        // raw-text element: everything up to the matching close tag is one
        // text child, regardless of what it looks like
        isRawText = true;
        htmlLower || (htmlLower = html.toLowerCase());
        const closeIndex = htmlLower.indexOf(
          '</' + current.name.toLowerCase() + '>',
          start,
        );
        const contentEnd = closeIndex === -1 ? html.length : closeIndex;
        const content = html.slice(start, contentEnd);
        if (content) {
          current.children.push({
            type: 'text',
            content,
          });
        }
        rawUntil = contentEnd;
      }

      if (
        !current.voidElement &&
        !inComponent &&
        !isRawText &&
        nextChar &&
        nextChar !== '<'
      ) {
        // text content runs to the next actual tag match; stray `<`
        // characters in between are part of the text
        current.children.push({
          type: 'text',
          content: html.slice(start, nextMatch ? nextMatch.index : undefined),
        });
      }

      // if we're at root, push new base node
      if (level === 0) {
        result.push(current);
      }

      parent = arr[level - 1];

      if (parent) {
        parent.children.push(current);
      }

      arr[level] = current;
    }

    if (!isOpen || current.voidElement) {
      if (
        level > -1 &&
        (current.voidElement || current.name === tag.slice(2, -1))
      ) {
        level--;
        // move current up a level to match the end tag
        current = level === -1 ? result : arr[level];
      }
      if (!inComponent && (nextChar !== '<' || isText) && nextChar) {
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        parent = level === -1 ? result : arr[level].children;

        // the text node runs to the next actual tag match; -1 means
        // there's no tag after it (trailing text)
        const end = nextMatch ? nextMatch.index : -1;
        let content = html.slice(start, end === -1 ? undefined : end);
        // if a node is nothing but whitespace, collapse it as the spec states:
        // https://www.w3.org/TR/html4/struct/text.html#h-9.1
        if (whitespaceRE.test(content)) {
          content = ' ';
        }
        // don't add whitespace-only text nodes if they would be trailing text nodes
        // or if they would be leading whitespace-only text nodes:
        //  * end > -1 indicates this is not a trailing text node
        //  * leading node is when level is -1 and parent has length 0
        if ((end > -1 && level + parent.length >= 0) || content !== ' ') {
          parent.push({
            type: 'text',
            content,
          });
        }
      }
    }
  });

  if (restoreNeeded) {
    restoreSentinels(result);
  }

  return result
}

function attrString(attrs) {
  const buff = [];
  for (const key in attrs) {
    if (attrs[key] === null) {
      // boolean attribute, render bare
      buff.push(key);
    } else {
      // escape double quotes so values parsed from single-quoted or
      // multiline attributes can't break out of the generated markup
      buff.push(key + '="' + String(attrs[key]).replace(/"/g, '&quot;') + '"');
    }
  }
  if (!buff.length) {
    return ''
  }
  return ' ' + buff.join(' ')
}

function stringifyNode(buff, doc) {
  switch (doc.type) {
    case 'text':
      return buff + doc.content
    case 'tag': {
      // a doctype is void but must not self-close: `<!DOCTYPE html>` not `<!DOCTYPE html/>`
      const tagEnd =
        doc.voidElement && doc.name.toLowerCase() !== '!doctype' ? '/>' : '>';
      buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + tagEnd;
      if (doc.voidElement) {
        return buff
      }
      return (
        buff + doc.children.reduce(stringifyNode, '') + '</' + doc.name + '>'
      )
    }
    case 'comment':
      buff += '<!--' + doc.comment + '-->';
      return buff
  }
}

function stringify(doc) {
  return doc.reduce(function (token, rootEl) {
    return token + stringifyNode('', rootEl)
  }, '')
}

var index = {
  parse,
  stringify,
};

export { index as default, parse, stringify };
