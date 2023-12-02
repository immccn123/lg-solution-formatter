# 洛谷题解格式化器

使用方法：

访问 <https://tj.imken.moe/> 直接使用构建好的 Webapp。

## 原理

```markdown
本题目我们可以使用 $dfs$ 解决。建边的话只用连 $u -> v$。**注意：** 要开long long 。
```

1. 将原来的 Markdown 拆分成各种 Tokens 并建立 AST，这里利用 remark 生态进行处理。
   - [Text Token] `本题目我们可以使用 `
   - [KaTeX Token] `$dfs$`
   - [Text Token] ` 解决。建边的话只用连 `
   - [KaTeX Token] `$u -> v$`
   - [Text Token] `。`
   - [Strong] `**`
      - [Text Token] 注意：
   - [Text Token] ` 要开long long 。`
2. 使用深度优先搜索遍历 AST，对于每一个 Token 里的文字分别进行格式化。例如：
   - [KaTeX Token] `$dfs$` -> `dfs`
   - [KaTeX Token] `$u -> v$` -> `$u \to v$`
   - [Text Token] ` 要开long long 。` -> ` 要开 long long。`

   其中，文字 Token 的格式化直接用 [pangu.js](https://github.com/vinta/pangu.js/) 搞定。

   KaTeX 的格式化流程是：

   1. 对 KaTeX 内部文字进行正则表达式匹配并替换。规则参见 `src/formatRules.ts` 下的 `katexReplaceRules`。
   2. 由于是正则表达式的简单替换，因此会出现多余空格。因此最后会将多个空格替换为一个。

4. 拼接 Token，并对 Token 渲染结果进行增删空格、全半角替换等行为。
5. 使用 remark-stringify 从 AST 进行还原。
