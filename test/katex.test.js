const { solFormatter } = require("../lib/lg-solution-formatter.cjs");
const { targetRegExp } = require("./testlib.js");

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

test("[KaTeX] => to \\Rightarrow", () => {
  const demoText = "因此，${\\rm cond1} => {\\rm cond2}$。";
  const target = "因此，${\\rm cond1} \\Rightarrow {\\rm cond2}$。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] != to \\neq", () => {
  const demoText = "显然， $i + 1 != j + 1$ 。";
  const target = "显然，$i + 1 \\neq j + 1$。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] gcd to \\gcd", () => {
  const demoText = "$gcd(a,b) = 1$，$\\gcd(x, y) = 2$";
  const target = "$\\gcd (a,b) = 1$，$\\gcd(x, y) = 2$";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] min to \\min", () => {
  const demoText = "$min(a,b) = 1$，$\\min(x, y) = 2$";
  const target = "$\\min (a,b) = 1$，$\\min(x, y) = 2$";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] max to \\max", () => {
  const demoText = "$max(a,b) = 1$，$\\max(x, y) = 2$";
  const target = "$\\max (a,b) = 1$，$\\max(x, y) = 2$";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] log to \\log", () => {
  const demoText = "本题时间复杂度是一个 $O(n log n)$ 的。$n\\log n$";
  const target = "本题时间复杂度是一个 $O(n \\log n)$ 的。$n\\log n$";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] LCA to \\operatorname{LCA}", () => {
  const demoText = "$LCA(s_1, s_2) \\operatorname{LCA}(s_2, s_3)$";
  const target = "$\\operatorname{LCA}(s_1, s_2) \\operatorname{LCA}(s_2, s_3)";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] lcm to \\operatorname{lcm}", () => {
  const demoText = "$lcm(s_1, s_2) \\operatorname{lcm}(s_2, s_3)$";
  const target = "$\\operatorname{lcm}(s_1, s_2) \\operatorname{lcm}(s_2, s_3)";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] MEX to \\operatorname{MEX}", () => {
  const demoText = "$MEX(s_1, s_2) \\operatorname{MEX}(s_2, s_3)$";
  const target = "$\\operatorname{MEX}(s_1, s_2) \\operatorname{MEX}(s_2, s_3)";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] X percent (50\\%) should not be formatted", () => {
  const demoText = "这道题暴力可以获得 $50\\%$ 的分数。";
  const target = "这道题暴力可以获得 $50\\%$ 的分数。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] array with [index] to _{index}", () => {
  const demoText = "$dp[i][j][k] = dp[i][j][k - 1] + a[i]$";
  const target = "$dp_{i,j,k} = dp_{i,j,k - 1} + a_{i}$";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});

test("[KaTeX] forbid KaTeX by keyword", () => {
  const demoText = "使用$dfs$解决。";
  const target = "使用 dfs 解决。";
  const res = solFormatter.parse(demoText);
  expect(res).toMatch(targetRegExp(target));
});
