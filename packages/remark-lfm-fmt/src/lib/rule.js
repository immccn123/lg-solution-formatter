// <https://github.com/vinta/pangu.js/blob/master/src/shared/core.js#L19>
const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff";
export const CJK_REGEX = new RegExp(`[${CJK}]`);

/**
 *
 * @param {string} pattern
 * @param {string} [flags]
 */
export const CJKRgx = (pattern, flags) =>
  new RegExp(pattern.replace(/\{CJK\}/g, `[${CJK}]`), flags);

/** @param {string} char */
export const isCJK = (char) => CJK_REGEX.test(char);

/**
 * @typedef ReplaceRule
 *   @property {RegExp} pattern
 *   @property {string | ((substring: string, ...args: string[]) => string)} target
 */

/** @type {ReplaceRule[]} */
export const katexReplaceRules = [
  { pattern: /\*/g, target: " \\times " }, // * -> 乘号
  { pattern: /<=/g, target: " \\le " }, // 小于等于
  { pattern: />=/g, target: " \\ge " }, // 大于等于
  { pattern: /\!=/g, target: " \\neq " }, // 不等于
  { pattern: /==/g, target: " = " }, // 不允许 ==
  { pattern: /(-+)>/g, target: " \\to " }, // ->
  { pattern: /<(-+)/g, target: " \\gets " }, // <-
  { pattern: /(=+)>/g, target: " \\Rightarrow " }, // =>
  { pattern: /(?<![\\{}])gcd/g, target: " \\gcd " }, // gcd -> \gcd
  { pattern: /(?<![\\{}])min/g, target: " \\min " },
  { pattern: /(?<![\\{}])max/g, target: " \\max " },
  { pattern: /(?<![\\{}])log/g, target: " \\log " },
  { pattern: /(?<!\\operatorname{)LCA(?!})/g, target: " \\operatorname{LCA}" },
  { pattern: /(?<!\\operatorname{)lcm(?!})/g, target: " \\operatorname{lcm}" },
  { pattern: /(?<!\\operatorname{)MEX(?!})/g, target: " \\operatorname{MEX}" },
  {
    pattern: /([a-zA-Z]+)((\[([^\]])+?\])+)/g,
    target: (_, name, items) => {
      return (
        name + "_{" + items.replace(/\[([^\]]+?)\]/g, "$1,").slice(0, -1) + "}"
      );
    },
  }, // dp[i][j][k] = dp[i][j][k - 1] + a[i]
];
