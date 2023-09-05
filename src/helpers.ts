import type { Rule } from './rules.ts';

/**
 * Helpers
 */

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

export function unescape(html: string) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

const caret = /(^|[^\[])\^/g;

export function edit(regex: Rule, opt?: string) {
  regex = typeof regex === 'string' ? regex : regex.source;
  opt = opt || '';
  const obj = {
    replace: (name: string | RegExp, val: string | RegExp) => {
      val = typeof val === 'object' && 'source' in val ? val.source : val;
      val = val.replace(caret, '$1');
      regex = (regex as string).replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}

export function cleanUrl(href: string) {
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

export const noopTest = { exec: () => null };

export function splitCells(tableRow: string, count?: number) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false;
      let curr = offset;
      while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
    cells = row.split(/ \|/);
  let i = 0;

  // First/last cell in a row cannot be empty if it has no leading/trailing pipe
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) {
    cells.pop();
  }

  if (count) {
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) cells.push('');
    }
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

/**
 * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
 * /c*$/ is vulnerable to REDOS.
 *
 * @param str
 * @param c
 * @param invert Remove suffix of non-c chars instead. Default falsey.
 */
export function rtrim(str: string, c: string, invert?: boolean) {
  const l = str.length;
  if (l === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  let suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.slice(0, l - suffLen);
}

export function findClosingBracket(str: string, b: string) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }

  let level = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

const CJKRegexStr =
  /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;
const CJKPunctuation = /[，。【】「」『』❲❳［］（）《》！？“”、～；：]/;
const nonCJKBracket = /[\(\)\[\]\{\}]/;
const nonCJKLBracket = /[\(\[\{]/;

export const CJKRgx = (regexStr: string): RegExp => {
  return RegExp(regexStr.replace('{CJK}', CJKRegexStr.source));
};

export const isCJK = (char: string) => CJKRegexStr.test(char);
export const isSpace = (char: string) => char === ' ';
export const isPunctuation = (char: string) => CJKPunctuation.test(char);
export const isNonCJKBracket = (char: string) => nonCJKBracket.test(char);
export const isNonCJKLBracket = (char: string) => nonCJKLBracket.test(char);
export const isNonCJKRBracket = (char: string) =>
  nonCJKBracket.test(char) && !nonCJKLBracket.test(char);

export const removeFrontSpace = (str: string) =>
  str.replace(/\s*([\S\s]+)/, '$1');
export const removeEndSpace = (str: string) =>
  str.replace(/([\S\s]+)\s*/, '$1');

export const shouldAddSpace = (last: string, now: string) => {
  // 中文标点
  if (isPunctuation(last) || isPunctuation(now)) return false;
  // 已经存在空格
  if (isSpace(last) || isSpace(now)) return false;
  // 汉字和汉字之间
  if (isCJK(last) === isCJK(now)) return false;
  // 半角括号和中文
  if (isNonCJKLBracket(last) || isNonCJKRBracket(now)) return false;
  return true;
};

export const shouldAddSpaceBetweenTokens = (
  last: string,
  now: string,
  lastRemoveSpace: boolean
) => {
  if (isCJK(last) && isCJK(now)) return lastRemoveSpace;
  if (!isCJK(last) && !isCJK(now)) return true && lastRemoveSpace;
  return shouldAddSpace(last, now);
};

export const shouldRemoveSpace = (last?: string, next?: string) => {
  // 多数情况下，中文标点前后不需要空格。
  if (last && isPunctuation(last)) return true;
  if (next && isPunctuation(next)) return true;
  // 半角左括号的右边不需要
  if (last && isNonCJKLBracket(last)) return true;
  // 半角右括号的左边不需要
  if (next && isNonCJKRBracket(next)) return true;
  // 多个空格留一个
  if (next && isSpace(next)) return true;
  // 中文和中文之间（人工强调）
  // 英文和英文之间（分词）
  // 中文和英文之间
  return false;
};

export const shouldFullWidth = (last: string, now: string) => {
  if (isCJK(last)) {
    return (() => {
      switch (now) {
        case '.':
        case ',':
        case ':':
        case ';':
          return true;
        default:
          return false;
      }
    })();
  }
  return false;
};

// 先把内部的字符串格式化。
export const formatString = (text: string): string => {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    if (i > 0 && shouldAddSpace(text[i - 1], text[i])) {
      out += ' ';
    }
    if (text[i] === ' ') {
      if (shouldRemoveSpace(text[i - 1], text[i + 1])) continue;
    }
    out += text[i];
  }
  return out;
};
