// https://stackoverflow.com/questions/21109011/javascript-unicode-string-chinese-character-but-no-punctuation
// https://stackoverflow.com/questions/19899554/unicode-range-for-japanese
const CJKRegexStr =
  /[\u31F0-\u31FF\u3220-\u3243\u3280-\u337F]|[\u30A0-\u30FF]|[\u3041-\u3096]|[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;
const CJKPunctuation = /[，。【】「」『』❲❳［］（）《》！？“”、～；：]/;
const nonCJKBracket = /[\(\)\[\]\{\}]/;
const nonCJKLBracket = /[\(\[\{]/;
const toFullWidth = /[!\?\.,:;]/;

export const CJKRgx = (regexStr: string, flags?: string): RegExp => {
  return RegExp(regexStr.replaceAll("{CJK}", CJKRegexStr.source), flags);
};

export const isCJK = (char: string) => CJKRegexStr.test(char);
export const isSpace = (char: string) => char === " ";
export const isPunctuation = (char: string) => CJKPunctuation.test(char);
export const isNonCJKBracket = (char: string) => nonCJKBracket.test(char);
export const isNonCJKLBracket = (char: string) => nonCJKLBracket.test(char);
export const isNonCJKRBracket = (char: string) =>
  nonCJKBracket.test(char) && !nonCJKLBracket.test(char);

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
  if (!(isCJK(last) || isPunctuation(last)) && !isCJK(now)) {
    return true && lastRemoveSpace;
  }
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
  // 中文 + 英文标点
  if (last && next && shouldFullWidth(last, next)) return true;
  // 中文和中文之间（人工强调）
  // 英文和英文之间（分词）
  // 中文和英文之间
  return false;
};

export const shouldFullWidth = (last: string, now: string) => {
  if (isCJK(last)) return toFullWidth.test(now);
  return false;
};

export const getFullWidth = (now: string) => {
  return (() => {
    switch (now) {
      case ".":
        return "。";
      case ",":
        return "，";
      case ":":
        return "：";
      case ";":
        return "；";
      case "!":
        return "！";
      case "?":
        return "？";
      default:
        return now;
    }
  })();
};

export interface replaceRule {
  match: RegExp;
  target: string | ((substring: string, ...args: any[]) => string);
}

export interface katexForbidRule {
  shouldForbid: (text: string) => boolean;
  replace?: (text: string) => string;
}

export const fullWidthReplaceRules: replaceRule[] = [
  { match: CJKRgx("(\\. )({CJK})", "g"), target: "。$2" },
  { match: CJKRgx("(\\? )({CJK})", "g"), target: "？$2" },
  { match: CJKRgx("(, )({CJK})", "g"), target: "，$2" },
  { match: CJKRgx("(; )({CJK})", "g"), target: "；$2" },
  { match: CJKRgx("(: )({CJK})", "g"), target: "：$2" },
  { match: CJKRgx("(! )({CJK})", "g"), target: "！$2" },
];

export const katexReplaceRules: replaceRule[] = [
  { match: /\*/g, target: " \\times " }, // * -> 乘号
  { match: /<=/g, target: " \\le " }, // 小于等于
  { match: />=/g, target: " \\ge " }, // 大于等于
  { match: /\!=/g, target: " \\neq " }, // 不等于
  { match: /==/g, target: " = " }, // 不允许 ==
  { match: /(-+)>/g, target: " \\to " }, // ->
  { match: /<(-+)/g, target: " \\gets " }, // <-
  { match: /(=+)>/g, target: " \\Rightarrow " }, // =>
  { match: /(?<![\\{}])gcd/g, target: " \\gcd " }, // gcd -> \gcd
  { match: /(?<![\\{}])min/g, target: " \\min " },
  { match: /(?<![\\{}])max/g, target: " \\max " },
  { match: /(?<![\\{}])log/g, target: " \\log " },
  { match: /(?<!\\operatorname{)LCA(?!})/g, target: " \\operatorname{LCA}" },
  { match: /(?<!\\operatorname{)lcm(?!})/g, target: " \\operatorname{lcm}" },
  { match: /(?<!\\operatorname{)MEX(?!})/g, target: " \\operatorname{MEX}" },
  {
    match: /([a-zA-Z]+)((\[([\S\s])+?\])+)/g,
    target: (_: string, name: string, items: string) => {
      return (
        name + "_{" + items.replace(/\[([\s\S]+?)\]/g, "$1,").slice(0, -1) + "}"
      );
    },
  }, // dp[i][j][k] = dp[i][j][k - 1] + a[i]
];

export const forbidKatexKeywords = [
  "dfs",
  "bfs",
  "bdfs",

  // 数据结构名称
  "odt",
  "trie",
  "heap",
  "treap",
  "splay",
  "fhq",
  "fhq treap",

  // 最短路算法名称
  "spfa",
  "dijkstra",
  "bellman-ford",

  // 网络流算法名称
  "dinic",
  "mcmf",
  "edmond-karp",

  // 比赛名称
  "noip",
  "csp",
  "csp-j",
  "csp-s",
  "csp-j/s",
  "usaco",
  "apio",

  // STL/libc/libstdc++
  "sort",
  "map",
  "set",
  "unordered_map",
  "unordered_set",
  "queue",
  "deque",
  "array",
  "pair",
  "tuple",
  "multiset",
  "multimap",
  "unordered_multiset",
  "unordered_multimap",
  "vector",
  "sscanf",
  "fill",
  "memset",
  "strcmp",
  "freopen",
  "fclose",
  "bitset",
  "cout",
  "cin",
  "sstream",
  "stringstream",
  "getline",
  "main",
  "fin",
  "fout",
  "fstream",
  "pair",
  "iostream",
  "stack",
  "priority_queue",
  "swap",
  "iterator",
  "list",
  "operator",
  "string",
  "next_permutation",
  "lower_bound",
  "upper_bound",
  "partial_sum",
  "unique",
  
  // 常用 C++ 关键字和别名
  "long long",
  "long\\ long",
  "int",
  "signed",
  "unsigned",
  "ull",
  "unsigned long long",
  "unsigned\\ long\\ long",
  "char",
  "bool",
  
  // 语言名称
  "pascal",
  "python",
  "rust",
  "ruby",

  // 杂项
  // "hash", [容易作为变量名]
  "sumhash",
  "google",
  "baidu",
  "bing",
  "input",
  "flag",
  "pbds",
  "pb_ds",
  "find",
];

export const forbidKatexKeywordsExactCase = ["BIT", "EK"];

export const forbidKatexRules: katexForbidRule[] = [
  {
    shouldForbid(text) {
      let res = false;
      forbidKatexKeywords.forEach((keyword) => {
        res ||= text.toLowerCase() === keyword;
      });
      forbidKatexKeywordsExactCase.forEach((keyword) => {
        res ||= text === keyword;
      });
      return res;
    },
  },
];
