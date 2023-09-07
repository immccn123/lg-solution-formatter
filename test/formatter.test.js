const { solFormatter } = require("../lib/lg-solution-formatter.cjs");

const targetRegExp = (target) => {
  return RegExp(
    target
      .replaceAll("\\", "\\\\")
      .replaceAll("$", "\\$")
      .replaceAll(".", "\\.")
      .replaceAll("?", "\\?")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll("[", "\\[")
      .replaceAll("]", "\\]")
      .replaceAll("|", "\\|")
      .replaceAll("*", "\\*")
  );
};

test("em with strong and English and Chinese", () => {
  const emStrongAndEnglish = `**Bold*和斜体with English*混排的案例**`;
  const res = solFormatter.parse(emStrongAndEnglish);
  expect(res).toMatch(/\*\*Bold \*和斜体 with English\* 混排的案例\*\*\S*/);
});

test("end of katex is CJK punctuation", () => {
  const demoText = "比方说 $1001,1010,1011$ 。现在判断 $1101$。";
  const target = "比方说 $1001,1010,1011$。现在判断 $1101$。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("front of katex is CJK punctuation [#1]", () => {
  const demoText = "不难看出， $N$的范围十分小，所以暴力即可。";
  const target = "不难看出，$N$ 的范围十分小，所以暴力即可。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("front of katex is CJK punctuation [#2]", () => {
  const demoText = "不难看出，$N$的范围十分小，所以暴力即可。";
  const target = "不难看出，$N$ 的范围十分小，所以暴力即可。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("end of katex is half width punctuation", () => {
  const demoText = "显然 $N\\le 10$, 所以暴力即可.";
  const target = "显然 $N\\le 10$，所以暴力即可。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("number + letter with CJK punctuation in the front", () => {
  const demoText = "双倍经验：CF1765F";
  const target = "双倍经验：CF1765F";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("number + letter with CJK character with end CJK punctuation [#1]", () => {
  const demoText = "一道思路和这个类似的题是CF1765F，结论大差不差。";
  const target = "一道思路和这个类似的题是 CF1765F，结论大差不差。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("number + letter with CJK character with end CJK punctuation [#2]", () => {
  const demoText = "我们设极大值为0x3f3f3f3f的原因是：";
  const target = "我们设极大值为 0x3f3f3f3f 的原因是：";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("inline code with CJK and punctuation [#1]", () => {
  const demoText = "对于这道题，我们可以使用`unordered_map` 。";
  const target = "对于这道题，我们可以使用 `unordered_map`。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("inline code with CJK and punctuation [#2]", () => {
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

test("link with CJK + (English) + punctuation", () => {
  const demoText =
    "这道题是[1358：中缀表达式值(expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358)，非常显然的结论。";
  const target =
    "这道题是 [1358：中缀表达式值 (expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358)，非常显然的结论。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("link with CJK + (English) + CJK", () => {
  const demoText =
    "这道题是[1358：中缀表达式值(expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358)很典的一道题。";
  const target =
    "这道题是 [1358：中缀表达式值 (expr)](http://ybt.ssoier.cn:8088/problem_show.php?pid=1358) 很典的一道题。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("extra space between CJK and punctuation", () => {
  const demoText = "`&` 的运算规则 ：";
  const target = "`&` 的运算规则：";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("extra space between CJK and half width punctuation", () => {
  const demoText = "先算 `&` 关联逻辑表达式的值 , 再算 `|` 关联逻辑表达式的值";
  const target = "先算 `&` 关联逻辑表达式的值，再算 `|` 关联逻辑表达式的值";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("mixed English, CJK punctuation [#1]", () => {
  const demoText = "原神startup! 启动！原神startup,  启动！";
  const target = "原神 startup！启动！原神 startup，启动！";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("English sentence with KaTeX [#1]", () => {
  const demoText = "An English sentence with $\\KaTeX$, and a comma.";
  const target = "An English sentence with $\\KaTeX$, and a comma.";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("space between strong tokens (issue #4)", () => {
  const demoText = "1. 两种运算并列时，`&` 运算**优先**于 `|` 运算。";
  const target = "1. 两种运算并列时，`&` 运算**优先**于 `|` 运算。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});
