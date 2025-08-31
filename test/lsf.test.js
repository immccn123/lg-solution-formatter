/**
 * @param {string} target
 */
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

import { formatSolution } from "@imkdown/lg-solution-formatter";
import { expect, test, describe } from "vitest";

const R = String.raw;

/**
 *
 * @param {string} desc
 * @param {{
 *   name: string,
 *   source: string,
 *   target: string
 * }[]} testCases
 */
function testAll(desc, testCases, fwPunctuation = true) {
  describe(desc, () => {
    testCases.forEach(({ name, source, target }) => {
      test.concurrent(name, async () => {
        const fmtedSolution = await formatSolution(source, { fwPunctuation });
        expect(fmtedSolution).toMatch(targetRegExp(target));
        expect(await formatSolution(fmtedSolution, { fwPunctuation })).toBe(
          fmtedSolution
        );
      });
    });
  });
}

const markdownTestCasesFw = [
  {
    name: "粗/斜体中英文混排",
    source: "**Bold*和斜体with English*混排的案例**",
    target: "**Bold *和斜体 with English* 混排的案例**",
  },
  {
    name: "数学公式后的多余空格",
    source: "比方说 $1001,1010,1011$ 。现在判断 $1101$。",
    target: "比方说 $1001,1010,1011$。现在判断 $1101$。",
  },
  {
    name: "数学公式前的多余空格及后部缺失空格",
    source: "不难看出， $N$的范围十分小，所以暴力即可。",
    target: "不难看出，$N$ 的范围十分小，所以暴力即可。",
  },
  {
    name: "英文逗号后方缺失空格",
    source: "显然 $N\\le 10$,所以暴力即可。",
    target: "显然 $N\\le 10$, 所以暴力即可。",
  },
  {
    name: "数字 + 字母的编号在中文字符前",
    source: "双倍经验：CF1765F",
    target: "双倍经验：CF1765F",
  },
  {
    name: "<1/2> 数字 + 字母的组合和中文混排",
    source: "一道思路和这个类似的题是CF1765F，结论大差不差。",
    target: "一道思路和这个类似的题是 CF1765F，结论大差不差。",
  },
  {
    name: "<2/2> 数字 + 字母的组合和中文混排",
    source: "我们设极大值为0x3f3f3f3f的原因是：",
    target: "我们设极大值为 0x3f3f3f3f 的原因是：",
  },
  {
    name: "<1/2> 内联代码和中文以及标点的混排",
    source: "对于这道题，我们可以使用`unordered_map` 。",
    target: "对于这道题，我们可以使用 `unordered_map`。",
  },
  {
    name: "<2/2> 内联代码和中文以及标点的混排",
    source: "对于这道题，我们可以使用 `unordered_map`。",
    target: "对于这道题，我们可以使用 `unordered_map`。",
  },
  {
    name: "<1/4> 三个英文句点到省略号的转换",
    source: "但是...我不知道怎么做",
    target: "但是…我不知道怎么做",
  },
  {
    name: "<2/4> 三个英文句点到省略号的转换",
    source: "但是....我不知道怎么做",
    target: "但是……我不知道怎么做",
  },
  {
    name: "<3/4> 三个英文句点到省略号的转换",
    source: "但是......我不知道怎么做",
    target: "但是……我不知道怎么做",
  },
  {
    name: "<4/4> 三个英文句点到省略号的转换",
    source: "但是................我不知道怎么做",
    target: "但是……我不知道怎么做",
  },
  {
    name: "链接前的空格缺失和英文括号的空格缺失",
    source: "这道题是[1358：中缀表达式值(expr)](link)，非常显然的结论。",
    target: "这道题是 [1358：中缀表达式值 (expr)](link)，非常显然的结论。",
  },
  {
    name: "链接前后的空格缺失和英文括号的空格缺失",
    source: "这道题是[1358：中缀表达式值(expr)](link)很典的一道题。",
    target: "这道题是 [1358：中缀表达式值 (expr)](link) 很典的一道题。",
  },
  {
    name: "中文字符和中文标点之间的多余空格",
    source: "`&` 的运算规则 ：",
    target: "`&` 的运算规则：",
  },
  {
    name: "<1/2> 前后有空格需要被转为全角标点的英文标点",
    source: "先算 `&` 关联逻辑表达式的值 , 再算 `|` 关联逻辑表达式的值",
    target: "先算 `&` 关联逻辑表达式的值，再算 `|` 关联逻辑表达式的值",
  },
  {
    name: "<2/2> 前后有空格需要被转为全角标点的英文标点",
    source:
      "这样 , 数组第一维是不是就可以压成 2 了呢？另外 , 因为是滚动数组 , 所以如果当前位置被马拦住了一定要记住清零。代码 :",
    target:
      "这样，数组第一维是不是就可以压成 2 了呢？另外，因为是滚动数组，所以如果当前位置被马拦住了一定要记住清零。代码：",
  },
  {
    name: "中英文标点大混排",
    source: "中文English! 你好！中文English,  你好！",
    target: "中文 English! 你好！中文 English, 你好！",
  },
  {
    name: "英文夹数学",
    source: "An English sentence with $\\rm{Math}$, and a comma.",
    target: "An English sentence with $\\rm{Math}$, and a comma.",
  },
  {
    // immccn123/lg-solution-formatter#4
    name: "中文排版中粗体字边缘不应添加空格 (#4)",
    source: "1. 两种运算并列时，`&` 运算**优先**于 `|` 运算。",
    target: "1. 两种运算并列时，`&` 运算**优先**于 `|` 运算。",
  },
  {
    name: "<1/2> 数学公式语法分析正确性",
    // [NOI 2022] 众数
    source: String.raw`$3 \ m \ x_1 \ x_2 \ x_m$：将 $x_1, x_2, \ldots, x_m$ 号序列顺次拼接，得到一个新序列，并询问其众数。如果不存在满足上述条件的数，则返回 $-1$。数据保证对于任意 $1 \le i \le m$，$x_i$ 是一个仍然存在的序列，$1 \le x_i \le n + q$，且拼接得到的序列非空。**注意：不保证 $\boldsymbol{x_1, \ldots, x_m}$ 互不相同，询问中的合并操作不会对后续操作产生影响。**`,
    target: String.raw`$3 \ m \ x_1 \ x_2 \ x_m$：将 $x_1, x_2, \ldots, x_m$ 号序列顺次拼接，得到一个新序列，并询问其众数。如果不存在满足上述条件的数，则返回 $-1$。数据保证对于任意 $1 \le i \le m$，$x_i$ 是一个仍然存在的序列，$1 \le x_i \le n + q$，且拼接得到的序列非空。**注意：不保证 $\boldsymbol{x_1, \ldots, x_m}$ 互不相同，询问中的合并操作不会对后续操作产生影响。**`,
  },
  {
    name: "<2/2> 数学公式语法分析正确性",
    // [NOI 2022] 众数
    source: String.raw`$4 \ x_1 \ x_2 \ x_3$：新建一个编号为 $x_3$ 的序列，其为 $x_1$ 号序列后顺次添加 $x_2$ 号序列中数字得到的结果，然后删除 $x_1, x_2$ 对应的序列。此时序列 $x_3$ 视为存在，而序列 $x_1, x_2$ 被视为不存在，在后续操作中也不会被再次使用。保证 $1 \le x_1, x_2, x_3 \le n + q$、$x_1 \ne x_2$、序列 $x_1, x_2$ 在操作前存在、且在操作前没有序列使用过编号 $x_3$。`,
    target: String.raw`$4 \ x_1 \ x_2 \ x_3$：新建一个编号为 $x_3$ 的序列，其为 $x_1$ 号序列后顺次添加 $x_2$ 号序列中数字得到的结果，然后删除 $x_1, x_2$ 对应的序列。此时序列 $x_3$ 视为存在，而序列 $x_1, x_2$ 被视为不存在，在后续操作中也不会被再次使用。保证 $1 \le x_1, x_2, x_3 \le n + q$、$x_1 \ne x_2$、序列 $x_1, x_2$ 在操作前存在、且在操作前没有序列使用过编号 $x_3$。`,
  },
  {
    name: "多级无序列表",
    source: "- QwQ\n  - quq可爱捏",
    target: "- QwQ\n  - quq 可爱捏",
  },
  {
    name: "多级有序列表",
    source: "1. QwQ\n   1. quq可爱捏\n   1. qwq",
    target: "1. QwQ\n   1. quq 可爱捏\n   2. qwq",
  },
  {
    name: "详细信息块的识别与格式化",
    source: `:::info[舞萌DX]\n不要越级打15\n:::`,
    target: `:::info[舞萌 DX]\n不要越级打 15\n:::`,
  },
  {
    name: "文本标签不应被识别",
    source: R`这是我们最新最热的 Re:Master 难度`,
    target: R`这是我们最新最热的 Re\:Master 难度`,
  },
  {
    name: "斜体里的文本标签不应被识别",
    source: R`_这是我们最新最热的 Re:Master 难度_`,
    target: R`*这是我们最新最热的 Re\:Master 难度*`,
  },
  {
    name: "粗体里的文本标签不应被识别",
    source: R`**这是我们最新最热的 Re:Master 难度**`,
    target: R`**这是我们最新最热的 Re\:Master 难度**`,
  },
  {
    name: "标题里的文本标签不应被识别",
    source: R`## 这是我们最新最热的 Re:Master 难度`,
    target: R`## 这是我们最新最热的 Re\:Master 难度`,
  },
  {
    name: "句末点号改为句号",
    source: R`OK.现在我们得到了答案.`,
    target: R`OK. 现在我们得到了答案。`,
  },
  {
    // immccn123/lg-solution-formatter#102
    name: "删去/不保留引号后多余空格 (#102)",
    // 成都市人民政府《成都市国土空间总体规划（2021-2035 年）》第 7 页
    source: R`“两水相依” 指西部岷江水网和东部沱江水网相依，河流水系呈现 “西密东疏” 和 “西渠东塘” 的特征。`,
    target: R`“两水相依”指西部岷江水网和东部沱江水网相依，河流水系呈现“西密东疏”和“西渠东塘”的特征。`,
  },
];

const mathTestCasesFw = [
  {
    name: "星号变 \\times, == 变 =",
    source: "仅当 $ a * b == c $ 的时候，我们才可以继续。",
    target: "仅当 $a \\times b = c$ 的时候，我们才可以继续。",
  },
  {
    name: "<= 变 \\le, >= 变 \\ge",
    source:
      "仅当 $ a \\times b >= c $ 的时候，或者 $ a \\times b <= d $ 的时候，我们才可以继续。",
    target:
      "仅当 $a \\times b \\ge c$ 的时候，或者 $a \\times b \\le d$ 的时候，我们才可以继续。",
  },
  {
    name: "-> 变 \\to, <- 变 \\gets",
    source: "无向图的建边就是建两条有向边，即建立 $u -> v$ 和 $u <- v$。",
    target: "无向图的建边就是建两条有向边，即建立 $u \\to v$ 和 $u \\gets v$。",
  },
  {
    name: "=> 变 \\Rightarrow",
    source: "因此，${\\rm cond1} => {\\rm cond2}$。",
    target: "因此，${\\rm cond1} \\Rightarrow {\\rm cond2}$。",
  },
  {
    name: "!= 变 \\neq",
    source: "显然， $i + 1 != j + 1$ 。",
    target: "显然，$i + 1 \\neq j + 1$。",
  },
  {
    name: "gcd 变 \\gcd",
    source: "$gcd(a,b) = 1$，$\\gcd(x, y) = 2$",
    target: "$\\gcd (a,b) = 1$，$\\gcd(x, y) = 2$",
  },
  {
    name: "min 变 \\min",
    source: "$min(a,b) = 1$，$\\min(x, y) = 2$",
    target: "$\\min (a,b) = 1$，$\\min(x, y) = 2$",
  },
  {
    name: "max 变 \\max",
    source: "$max(a,b) = 1$，$\\max(x, y) = 2$",
    target: "$\\max (a,b) = 1$，$\\max(x, y) = 2$",
  },
  {
    name: "log 变 \\log",
    source: "本题时间复杂度是一个 $O(n log n)$ 的。$n\\log n$",
    target: "本题时间复杂度是一个 $O(n \\log n)$ 的。$n\\log n$",
  },
  {
    name: "LCA 变 \\operatorname{LCA}",
    source: "$LCA(s_1, s_2) \\operatorname{LCA}(s_2, s_3)$",
    target: "$\\operatorname{LCA}(s_1, s_2) \\operatorname{LCA}(s_2, s_3)$",
  },
  {
    name: "lcm 变 \\operatorname{lcm}",
    source: "$lcm(s_1, s_2) \\operatorname{lcm}(s_2, s_3)$",
    target: "$\\operatorname{lcm}(s_1, s_2) \\operatorname{lcm}(s_2, s_3)$",
  },
  {
    name: "MEX 变 \\operatorname{MEX}",
    source: "$MEX(s_1, s_2) \\operatorname{MEX}(s_2, s_3)$",
    target: "$\\operatorname{MEX}(s_1, s_2) \\operatorname{MEX}(s_2, s_3)$",
  },
  {
    name: "<1/2> 公式中带下标的 C/C++ 数组形式变 _{index} 形式",
    source: "$dp[i][j][k] = dp[i][j][k - 1] + a[i]$",
    target: "$dp_{i,j,k} = dp_{i,j,k - 1} + a_{i}$",
  },
  {
    name: "<2/2> 公式中带下标的 C/C++ 数组形式变 _{index} 形式",
    source: R`$\sqrt[x]{n} a dp[i][j][k] = dp[i][j][k - 1] + a[i]$`,
    target: R`$\sqrt[x]{n} a dp_{i,j,k} = dp_{i,j,k - 1} + a_{i}$`,
  },
  {
    name: "不对公式中的带方括号参数的指令进行格式化",
    source: R`$\sqrt[x]{n}$`,
    target: R`$\sqrt[x]{n}$`,
  },
];

const markdownTestCasesHw = [
  {
    name: "粗/斜体中英文混排",
    source: "**Bold*和斜体with English*混排的案例**",
    target: "**Bold *和斜体 with English* 混排的案例**",
  },
  {
    name: "数学公式后的多余空格",
    source: "比方说 $1001,1010,1011$ 。现在判断 $1101$。",
    target: "比方说 $1001,1010,1011$. 现在判断 $1101$.",
  },
  {
    name: "数学公式前的多余空格及后部缺失空格",
    source: "不难看出， $N$的范围十分小，所以暴力即可。",
    target: "不难看出, $N$ 的范围十分小, 所以暴力即可.",
  },
  {
    name: "英文逗号后方缺失空格",
    source: "显然 $N\\le 10$,所以暴力即可。",
    target: "显然 $N\\le 10$, 所以暴力即可.",
  },
  {
    name: "数字 + 字母的组合和中文混排",
    source: "一道思路和这个类似的题是CF1765F，结论大差不差。",
    target: "一道思路和这个类似的题是 CF1765F, 结论大差不差.",
  },
  {
    name: "<1/2> 内联代码和中文以及标点的混排",
    source: "对于这道题，我们可以使用`unordered_map` .",
    target: "对于这道题, 我们可以使用 `unordered_map`.",
  },
  {
    name: "<2/2> 内联代码和中文以及标点的混排",
    source: "对于这道题，我们可以使用 `unordered_map`。",
    target: "对于这道题, 我们可以使用 `unordered_map`.",
  },
  {
    name: "链接前后的空格缺失和英文括号的空格缺失",
    source: "这道题是[1358：中缀表达式值(expr)](link)很典的一道题。",
    target: "这道题是 [1358: 中缀表达式值 (expr)](link) 很典的一道题.",
  },
  {
    name: "中文字符和中文标点之间的多余空格",
    source: "`&` 的运算规则 ：",
    target: "`&` 的运算规则:",
  },
  {
    name: "<1/2> 前后有空格的英文标点",
    source: "先算 `&` 关联逻辑表达式的值 , 再算 `|` 关联逻辑表达式的值",
    target: "先算 `&` 关联逻辑表达式的值, 再算 `|` 关联逻辑表达式的值",
  },
  {
    name: "<2/2> 前后有空格的英文标点",
    source:
      "这样 , 数组第一维是不是就可以压成 2 了呢？另外 , 因为是滚动数组 , 所以如果当前位置被马拦住了一定要记住清零。代码 :",
    target:
      "这样, 数组第一维是不是就可以压成 2 了呢? 另外, 因为是滚动数组, 所以如果当前位置被马拦住了一定要记住清零. 代码:",
  },
  {
    name: "中英文标点混排",
    source: "中文English! 你好！中文English,  你好！",
    target: "中文 English! 你好! 中文 English, 你好!",
  },
  {
    // immccn123/lg-solution-formatter#4
    name: "中文排版中粗体字边缘不应添加空格 (#4)",
    source: "1. 两种运算并列时，`&` 运算**优先**于 `|` 运算。",
    target: "1. 两种运算并列时, `&` 运算**优先**于 `|` 运算.",
  },
  {
    name: "半角标点后代码块应添加空格",
    source: "两种运算并列时,`&` 运算**优先**于 `|` 运算。",
    target: "两种运算并列时, `&` 运算**优先**于 `|` 运算.",
  },
  {
    name: "数学公式前后标点分析正确性",
    // [NOI 2022] 众数
    source: String.raw`$3 \ m \ x_1 \ x_2 \ x_m$：将 $x_1, x_2, \ldots, x_m$ 号序列顺次拼接，得到一个新序列，并询问其众数。如果不存在满足上述条件的数，则返回 $-1$。数据保证对于任意 $1 \le i \le m$，$x_i$ 是一个仍然存在的序列，$1 \le x_i \le n + q$，且拼接得到的序列非空。**注意：不保证 $\boldsymbol{x_1, \ldots, x_m}$ 互不相同，询问中的合并操作不会对后续操作产生影响。**`,
    target: String.raw`$3 \ m \ x_1 \ x_2 \ x_m$: 将 $x_1, x_2, \ldots, x_m$ 号序列顺次拼接, 得到一个新序列, 并询问其众数. 如果不存在满足上述条件的数, 则返回 $-1$. 数据保证对于任意 $1 \le i \le m$, $x_i$ 是一个仍然存在的序列, $1 \le x_i \le n + q$, 且拼接得到的序列非空. **注意: 不保证 $\boldsymbol{x_1, \ldots, x_m}$ 互不相同, 询问中的合并操作不会对后续操作产生影响.**`,
  },
  {
    name: "句末句号改为点号",
    source: R`OK.现在我们得到了答案。`,
    target: R`OK. 现在我们得到了答案.`,
  },
];

testAll("<全角/默认配置> Markdown 杂项", markdownTestCasesFw);
testAll("<半角配置> Markdown 杂项", markdownTestCasesHw, false);
testAll("<全角/默认配置> 数学公式格式化", mathTestCasesFw);
