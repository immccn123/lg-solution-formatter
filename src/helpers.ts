import {
  fullWidthReplaceRules,
  getFullWidth,
  katexReplaceRules,
  shouldAddSpace,
  shouldAddSpaceBetweenTokens,
  shouldFullWidth,
  shouldRemoveSpace
} from './formatRules.ts';
import type { Rule } from './matchRules.ts';

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

// 先把内部的字符串格式化。
export const formatString = (text: string): string => {
  let out = '';
  // 先删除多余空格
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      if (shouldRemoveSpace(out[out.length - 1], text[i + 1])) continue;
    }
    out += text[i];
  }
  text = out;
  // 然后添加缺失的空格
  out = "";
  for (let i = 0; i < text.length; i++) {
    let isReplaced = false;
    if (i > 0 && shouldFullWidth(text[i - 1], text[i])) {
      out += getFullWidth(text[i]);
      isReplaced = true;
    }
    if (text[i] === ' ') {
      if (shouldRemoveSpace(out[out.length - 1], text[i + 1])) continue;
    }
    if (i > 0 && shouldAddSpace(out[out.length - 1], text[i])) {
      out += ' ';
    }
    if (!isReplaced) out += text[i];
  }
  for (const i in fullWidthReplaceRules) {
    const rule = fullWidthReplaceRules[i];
    if (typeof rule.target === 'string') {
      out = out.replace(rule.match, rule.target);
    } else {
      out = out.replace(rule.match, rule.target);
    }
  }
  return out;
};

export const trimToken = (
  mdText: string,
  displayText: string,
  markdownText: string,
  newDisplayText: string,
  isTrimed: boolean
) => {
  if (
    displayText.length - 1 >= 0
    && shouldAddSpaceBetweenTokens(
      displayText[displayText.length - 1],
      newDisplayText.trim()[0],
      isTrimed || newDisplayText !== newDisplayText.trimStart()
    )
  ) {
    mdText += ' ';
    displayText += ' ';
  }
  mdText += markdownText.trim();
  displayText += newDisplayText.trim();
  isTrimed = newDisplayText !== newDisplayText.trimEnd();
  return { mdText, isTrimed, displayText };
};

export const formatKatex = (text: string): string => {
  let out = text;
  for (const i in katexReplaceRules) {
    const rule = katexReplaceRules[i];
    if (typeof rule.target === 'string') {
      out = out.replace(rule.match, rule.target);
    } else {
      out = out.replace(rule.match, rule.target);
    }
  }
  out = out.replace(/  /g, " ");
  return out;
};
