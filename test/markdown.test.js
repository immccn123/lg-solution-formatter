const { solFormatter } = require("../lib/lg-solution-formatter.cjs");
const { targetRegExp } = require("./testlib.js");

test("[MD] em with strong and English and Chinese", () => {
  const emStrongAndEnglish = `**Bold*和斜体with English*混排的案例**`;
  const res = solFormatter.parse(emStrongAndEnglish);
  expect(res).toMatch(/\*\*Bold \*和斜体 with English\* 混排的案例\*\*\S*/);
});

test("[MD] end of katex is CJK punctuation", () => {
  const demoText = "比方说 $1001,1010,1011$ 。现在判断 $1101$。";
  const target = "比方说 $1001,1010,1011$。现在判断 $1101$。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] front of katex is CJK punctuation (#1)", () => {
  const demoText = "不难看出， $N$的范围十分小，所以暴力即可。";
  const target = "不难看出，$N$ 的范围十分小，所以暴力即可。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] front of katex is CJK punctuation (#2)", () => {
  const demoText = "不难看出，$N$的范围十分小，所以暴力即可。";
  const target = "不难看出，$N$ 的范围十分小，所以暴力即可。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] end of katex is half width punctuation", () => {
  const demoText = "显然 $N\\le 10$, 所以暴力即可.";
  const target = "显然 $N\\le 10$，所以暴力即可。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] number + letter with CJK punctuation in the front", () => {
  const demoText = "双倍经验：CF1765F";
  const target = "双倍经验：CF1765F";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] number + letter with CJK character with end CJK punctuation (#1)", () => {
  const demoText = "一道思路和这个类似的题是CF1765F，结论大差不差。";
  const target = "一道思路和这个类似的题是 CF1765F，结论大差不差。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] number + letter with CJK character with end CJK punctuation (#2)", () => {
  const demoText = "我们设极大值为0x3f3f3f3f的原因是：";
  const target = "我们设极大值为 0x3f3f3f3f 的原因是：";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] inline code with CJK and punctuation (#1)", () => {
  const demoText = "对于这道题，我们可以使用`unordered_map` 。";
  const target = "对于这道题，我们可以使用 `unordered_map`。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] inline code with CJK and punctuation (#2)", () => {
  const demoText = "对于这道题，我们可以使用 `unordered_map`。";
  const target = "对于这道题，我们可以使用 `unordered_map`。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

// test("a text with ...", () => {
//   const demoText = "但是...我不知道怎么做";
//   const target = "但是…我不知道怎么做";
//   const res = solFormatter.parse(demoText);
//   expect(res).toMatch(targetRegExp(target));
// });

test("[MD] link with CJK + (English) + punctuation", () => {
  const demoText =
    "这道题是[1358：中缀表达式值(expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358)，非常显然的结论。";
  const target =
    "这道题是 [1358：中缀表达式值 (expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358)，非常显然的结论。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] link with CJK + (English) + CJK", () => {
  const demoText =
    "这道题是[1358：中缀表达式值(expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358)很典的一道题。";
  const target =
    "这道题是 [1358：中缀表达式值 (expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358) 很典的一道题。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] extra space between CJK and punctuation", () => {
  const demoText = "`&` 的运算规则 ：";
  const target = "`&` 的运算规则：";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] extra space between CJK and half width punctuation", () => {
  const demoText = "先算 `&` 关联逻辑表达式的值 , 再算 `|` 关联逻辑表达式的值";
  const target = "先算 `&` 关联逻辑表达式的值，再算 `|` 关联逻辑表达式的值";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] mixed English, CJK punctuation", () => {
  const demoText = "原神startup! 启动！原神startup,  启动！";
  const target = "原神 startup！启动！原神 startup，启动！";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] English sentence with KaTeX", () => {
  const demoText = "An English sentence with $\\KaTeX$, and a comma.";
  const target = "An English sentence with $\\KaTeX$, and a comma.";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] <issue #4> space between strong tokens", () => {
  const demoText = "1. 两种运算并列时，`&` 运算**优先**于 `|` 运算。";
  const target = "1. 两种运算并列时，`&` 运算**优先**于 `|` 运算。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] half-width punctuation with space around", () => {
  const demoText =
    "这样 , 数组第一维是不是就可以压成 2 了呢？另外 , 因为是滚动数组 , 所以如果当前位置被马拦住了一定要记住清零。代码 :";
  const target =
    "这样，数组第一维是不是就可以压成 2 了呢？另外，因为是滚动数组，所以如果当前位置被马拦住了一定要记住清零。代码：";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] <issue #12> KaTeX lexing #1", () => {
  // The copyright of the text belongs to the Computer Federation of China.
  const demoText = String.raw`$3 \ m \ x_1 \ x_2 \ x_m$：将 $x_1, x_2, \ldots, x_m$ 号序列顺次拼接，得到一个新序列，并询问其众数。如果不存在满足上述条件的数，则返回 $-1$。数据保证对于任意 $1 \le i \le m$，$x_i$ 是一个仍然存在的序列，$1 \le x_i \le n + q$，且拼接得到的序列非空。**注意：不保证 $\boldsymbol{x_1, \ldots, x_m}$ 互不相同，询问中的合并操作不会对后续操作产生影响。**`;
  const target = String.raw`$3 \ m \ x_1 \ x_2 \ x_m$：将 $x_1, x_2, \ldots, x_m$ 号序列顺次拼接，得到一个新序列，并询问其众数。如果不存在满足上述条件的数，则返回 $-1$。数据保证对于任意 $1 \le i \le m$，$x_i$ 是一个仍然存在的序列，$1 \le x_i \le n + q$，且拼接得到的序列非空。**注意：不保证 $\boldsymbol{x_1, \ldots, x_m}$ 互不相同，询问中的合并操作不会对后续操作产生影响。**`;
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[MD] <issue #12> KaTeX lexing #2", () => {
  // The copyright of the text belongs to the Computer Federation of China.
  const demoText = String.raw`$4 \ x_1 \ x_2 \ x_3$：新建一个编号为 $x_3$ 的序列，其为 $x_1$ 号序列后顺次添加 $x_2$ 号序列中数字得到的结果，然后删除 $x_1, x_2$ 对应的序列。此时序列 $x_3$ 视为存在，而序列 $x_1, x_2$ 被视为不存在，在后续操作中也不会被再次使用。保证 $1 \le x_1, x_2, x_3 \le n + q$、$x_1 \ne x_2$、序列 $x_1, x_2$ 在操作前存在、且在操作前没有序列使用过编号 $x_3$。`;
  const target = String.raw`$4 \ x_1 \ x_2 \ x_3$：新建一个编号为 $x_3$ 的序列，其为 $x_1$ 号序列后顺次添加 $x_2$ 号序列中数字得到的结果，然后删除 $x_1, x_2$ 对应的序列。此时序列 $x_3$ 视为存在，而序列 $x_1, x_2$ 被视为不存在，在后续操作中也不会被再次使用。保证 $1 \le x_1, x_2, x_3 \le n + q$、$x_1 \ne x_2$、序列 $x_1, x_2$ 在操作前存在、且在操作前没有序列使用过编号 $x_3$。`;
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});
