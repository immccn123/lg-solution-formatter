/**
 * @typedef ReplaceRule
 *   @property {RegExp} pattern
 *   @property {string | ((substring: string, ...args: string[]) => string)} replace
 */

// <https://github.com/vinta/pangu.js/blob/master/src/shared/core.js#L19>
export const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff";
export const CJK_REGEX = new RegExp(`[${CJK}]`);

export const FW_PUNCTUATION = /[，。【】「」『』❲❳［］（）《》！？“”、～；：]/;
export const HW_PUNCTUATION = /[\!\?\.,:;]/;
export const TO_HW_BEGIN = /^[\!\?\.,:;] */;

/**
 *
 * @param {string} pattern
 * @param {string} [flags]
 */
export const CjkRgx = (pattern, flags) =>
  new RegExp(pattern.replace(/\{CJK\}/g, `[${CJK}]`), flags);

/** @param {string} chr */
export const isCjk = (chr) => CJK_REGEX.test(chr);

/** @param {string} chr */
export const isCjkPunctuation = (chr) => FW_PUNCTUATION.test(chr);

/** @param {string} chr */
export const toFw = (chr) =>
  chr
    .replace(/,/g, "，")
    .replace(/:/g, "：")
    .replace(/;/g, "；")
    .replace(/\!/g, "！")
    .replace(/\?/g, "？")
    .replace(/\./g, "。");

/** @param {string} text */
export const punctuationCjkToFw = (text) =>
  text
    .replace(CjkRgx("({CJK}),\\s*", "g"), "$1，")
    .replace(CjkRgx("({CJK}):\\s*", "g"), "$1：")
    .replace(CjkRgx("({CJK});\\s*", "g"), "$1；")
    .replace(CjkRgx("({CJK})\\!\\s*", "g"), "$1！")
    .replace(CjkRgx("({CJK})\\?\\s*", "g"), "$1？")
    .replace(CjkRgx("({CJK})\\.\\s*", "g"), "$1。");

/** @param {string} text */
export const fwPunctuationToHw = (text) =>
  text
    .replace(/，\s*/g, ", ")
    .replace(/：\s*/g, ": ")
    .replace(/；\s*/g, "; ")
    .replace(/！\s*/g, "! ")
    .replace(/？\s*/g, "? ")
    .replace(/。\s*/g, ". ");

/**
 * @type {ReplaceRule[]}
 *
 * 数学公式的替换规则，优先级从上到下。
 */
export const mathReplaceRules = [
  { pattern: /\*/g, replace: " \\times " }, // * -> 乘号
  { pattern: /<=/g, replace: " \\le " }, // 小于等于
  { pattern: />=/g, replace: " \\ge " }, // 大于等于
  { pattern: /\!=/g, replace: " \\neq " }, // 不等于
  { pattern: /==/g, replace: " = " }, // 不允许 ==
  { pattern: /(-+)>/g, replace: " \\to " }, // ->
  { pattern: /<(-+)/g, replace: " \\gets " }, // <-
  { pattern: /(=+)>/g, replace: " \\Rightarrow " }, // =>
  { pattern: /(?<![\\{}])gcd/g, replace: " \\gcd " }, // gcd -> \gcd
  { pattern: /(?<![\\{}])min/g, replace: " \\min " },
  { pattern: /(?<![\\{}])max/g, replace: " \\max " },
  { pattern: /(?<![\\{}])log/g, replace: " \\log " },
  { pattern: /(?<!\\operatorname{)LCA(?!})/g, replace: " \\operatorname{LCA}" },
  { pattern: /(?<!\\operatorname{)lcm(?!})/g, replace: " \\operatorname{lcm}" },
  { pattern: /(?<!\\operatorname{)MEX(?!})/g, replace: " \\operatorname{MEX}" },
  {
    pattern: /(?<!\\|[a-zA-Z])([a-zA-Z]+)((\[([^\]])+?\])+)/g,
    replace: (_, name, items) => {
      return (
        name + "_{" + items.replace(/\[([^\]]+?)\]/g, "$1,").slice(0, -1) + "}"
      );
    },
  }, // dp[i][j][k] = dp[i][j][k - 1] + a[i]
];

/**
 * @param {string} left
 * @param {string} right
 * @param {boolean} [addExtraSpace]
 */
export const shouldAddSpace = (left, right, addExtraSpace = false) => {
  /**
   * 任何中文标点都不需要添加空格。
   *
   * ```diff
   * - 这个想法很 naive ，就是说……
   * + 这个想法很 naive，就是说……
   * ```
   */
  if (isCjkPunctuation(left) || isCjkPunctuation(right)) return false;
  /**
   * 半角标点之后的任意字符需要添加空格。
   *      Sentence. Another sentence.
   *              ^ ^
   */

  if (HW_PUNCTUATION.test(left) && !HW_PUNCTUATION.test(right)) return true;
  /**
   * 半角标点之前的任意字符不能添加空格。
   *      Sentence.
   *             ^^
   */
  if (!HW_PUNCTUATION.test(left) && HW_PUNCTUATION.test(right)) return false;
  /**
   * 中文之间通常不需要添加，除非明确标记额外添加空格。
   * 同理来说英文也是这样的，但是这个需要 @link concatToken 的时候进行一个特判。
   */
  if (isCjk(left) === isCjk(right)) return addExtraSpace;
  return true;
};

/**
 * @type {ReplaceRule[]}
 *
 * 文本预处理替换规则
 */
export const textPreprocessRules = [
  {
    pattern: CjkRgx(`(${HW_PUNCTUATION.source})({CJK})`, "g"),
    replace: "$1 $2",
  },
  {
    pattern: CjkRgx(`({CJK}) +(${HW_PUNCTUATION.source})`, "g"),
    replace: "$1$2",
  },
  {
    pattern: CjkRgx(`({CJK}) +(${FW_PUNCTUATION.source})`, "g"),
    replace: "$1$2",
  },
];

/**
 * @type {ReplaceRule[]}
 *
 * 文本后期处理替换规则
 */
export const textPostprocessRules = [
  {
    // see immccn123/lg-solution-formatter#102
    pattern: CjkRgx(`(”) +({CJK})`, "g"),
    replace: "$1$2",
  },
];

/**
 * @type {ReplaceRule[]}
 *
 * 额外的全半角标点的替换规则
 */
export const toFwExtraRules = [
  {
    pattern: /\.{3,}/g,
    replace: (match) => "…".repeat(Math.min(Math.ceil(match.length / 3), 2)),
  },
  {
    pattern: /… /g,
    replace: (match) => "…".repeat(Math.min(Math.ceil(match.length / 3), 2)),
  },
];
