// stores/counter.js
import { defineStore } from "pinia";

const DEFAULT_CODE: string = `# 洛谷题解格式化器

粘贴你的题解（不粘贴也可以），然后点击下方的“格式化并展示差异”看看效果！

## 可以更改数学公式替换规则

你可以在下方选项菜单中来看！例如，现在已经不会默认替换$*$到$\\times$了，但是 $gcd$ 仍会替换为$\\gcd$。

## 文字内容已经适配25年7月渲染更新

::cute-table{attr}

::::info[舞萌DX初心者向全曲目解禁攻略]{open}
使用 \`{open}\` 可自动展开。所以你知道怎么解禁吗，反正我不知道。
::::

## clang-format

可以考虑在下方*选项*菜单中启用。

\`\`\`cpp
#include   <iostream>
// 这是一个架空的内容。
 int  main( ){ 
double diff ; std ::cout<<"Input timing offset(ms):"; 
 std::cin  >>diff ;
 if(   diff<22  )  std::cout << "Marvelous\\n" ;
 else   if( diff<45 )std::cout<<"Perfect\\n";
      else if( diff<90) std::cout<<"Good\\n";else    std::cout<<"Miss\\n";
return 0 ;}
\`\`\`

## 中文与英文混合句子

这是一个*不太标准*的排版案例, 在这里我们看到中文与英文之间没有添加适当的空格。数学公式如$a[i][j][k]$也没有进行正确的排版处理。

## 标点符号的使用

例如,在这句话中:中文*and*标点符号混杂在一起,没有进行任何适当的格式化.再如: $i*j=k$ 在数学表达式中, 星号并未转换为乘号，并且没有使用正确的LaTeX语法。

## 数学公式的替换

比如在代码中，你可能会遇到这种情况:

$$a[i][j] != b[i][j]$$

美元符号前/后没有换行所以这个东西仍然是行内公式。此外,此公式中的\`!=\`运算符应该被替换为不等号符号。同样地,运算符$u->v$和$a<=b$在数学排版中应该有正确的替换方式。

## 空格与 标点符号

中文标点和英文标点有时会挨在一起，比如“哈罗,World!”,这应该得到适当的处理。`;

const CLANG_DEFAULT_CONFIG = `---
BasedOnStyle: Google
IndentWidth: 4
UseTab: Always
TabWidth: 4`;

interface State {
  code: string;
  clangEnabled: boolean;
  clangConfig: string;
  enabledMathRules: string[];
}

export const useStore = defineStore("counter", {
  state: () => {
    const item = localStorage.getItem("state");
    if (item) return JSON.parse(item) as State;
    return {
      code: DEFAULT_CODE,
      clangEnabled: false,
      clangConfig: CLANG_DEFAULT_CONFIG,
      enabledMathRules: [
        "fn/gcd",
        "fn/min",
        "fn/max",
        "fn/log",
        "fn/lca",
        "fn/lcm",
        "fn/mex",
        "sym/double-arrow-implies",
        "sym/arrow-left-gets",
        "sym/arrow-right-to",
        "sym/not-equal",
        "sym/greater-equal",
        "sym/less-equal",
      ],
    } as State;
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {},
});
