// stores/counter.js
import { defineStore } from "pinia";

const DEFAULT_CODE: string = `# 洛谷题解格式化器

点击下方的“格式化并展示差异”看看效果，或者粘贴你的题解！

## clang-format

如果浏览器比较新并且支持WebAssembly,可以考虑在下方*选项*菜单中启用。

\`\`\`cpp
#include       <iostream>

int  main(         ) 
{
    int a=10  
;int b=  20;int   
    result=a+    
    b  
    ;if(result>20) 
    {
        std::cout    <<  "Result is greater than 20"    <<std::endl;} 
    else 
    {    std::cout    <<     "Result is 20 or less" << std::endl;
    }

    for  (int   
    i = 0;    
    i   <    5; i    ++) 
    {

        std::cout<<  "Loop iteration: "    << i    << std::endl;

    }


    return   0;    
}

\`\`\`

## 中文与英文混合句子

这是一个*不太标准*的排版案例, 在这里我们看到中文与英文之间没有添加适当的空格。数学公式如$a[i][j][k]$也没有进行正确的排版处理。

这是一个*non-standard*的排版案例。In this case,我们看到Chinese和English之间没有添加适当的space。Math formula也没有正确进行处理。

## 标点符号的使用

例如,在这句话中:中文与标点符号混杂在一起,没有进行任何适当的格式化.再如: $i*j=k$ 在数学表达式中, 星号并未转换为乘号，并且没有使用正确的 LaTeX 语法。

## 数学公式的替换

比如在代码中，你可能会遇到这种情况:

$$a[i][j] != b[i][j]$$

此公式中的\`!=\`运算符应该被替换为不等号符号。同样地,运算符$u->v$和$a<=b$在数学排版中应该有正确的替换方式。

## 空格与 标点符号

中文标点和英文标点有时会挨在一起，比如“哈罗,World!”,这应该得到适当的处理。`;

const CLANG_DEFAULT_CONFIG = `---
BasedOnStyle: WebKit
IndentWidth: 4`

interface State {
  code: string;
  clangEnabled: boolean;
  clangConfig: string;
}

export const useStore = defineStore("counter", {
  state: () => {
    const item = localStorage.getItem("state");
    if (item) return JSON.parse(item) as State;
    return {
      code: DEFAULT_CODE,
      clangEnabled: false,
      clangConfig: CLANG_DEFAULT_CONFIG,
    } as State;
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {},
});
