const { solFormatter } = require("../lib/lg-solution-formatter.cjs");

const targetRegExp = (target) => {
  return RegExp(
    target
      .replaceAll("\\", "\\\\")
      .replaceAll("$", "\\$")
      .replaceAll(".", "\\.")
      .replaceAll("?", "\\?")
      .replaceAll("*", "\\*")
      .replaceAll("+", "\\+")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll("[", "\\[")
      .replaceAll("]", "\\]")
      .replaceAll("|", "\\|")
      .replaceAll("{", "\\{")
      .replaceAll("}", "\\}")
  );
};

test("[KaTeX] star to \\times, == to =", () => {
  const demoText = "仅当 $ a * b == c $ 的时候，我们才可以继续。";
  const target = "仅当 $a \\times b = c$ 的时候，我们才可以继续。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] <= to \\le, >= to \\ge", () => {
  const demoText =
    "仅当 $ a \\times b >= c $ 的时候，或者 $ a \\times b <= d $ 的时候，我们才可以继续。";
  const target =
    "仅当 $a \\times b \\ge c$ 的时候，或者 $a \\times b \\le d$ 的时候，我们才可以继续。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] -> to \\to, <- to \\gets", () => {
  const demoText =
    "无向图的建边就是建两条有向边，即建立 $u -> v$ 和 $u <- v$。";
  const target =
    "无向图的建边就是建两条有向边，即建立 $u \\to v$ 和 $u \\gets v$。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] != to \\neq", () => {
  const demoText = "显然， $i + 1 != j + 1$ 。";
  const target = "显然，$i + 1 \\neq j + 1$。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] number/number to \\frac", () => {
  const demoText = "$1/2 + 3/4$";
  const target = "$\\frac{1}{2} + \\frac{3}{4}$";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] X percent (50\\%) should not be formatted", () => {
  const demoText = "这道题暴力可以获得 $50\\%$ 的分数。";
  const target = "这道题暴力可以获得 $50\\%$ 的分数。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});
