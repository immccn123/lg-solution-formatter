# 洛谷题解格式化器

使用方法：

```
pnpm install
pnpm build
cat filename.md | node bin/marked.js
```

或者访问 <https://tj.imken.moe/>。


基于 marked.js [Copyright (c) 2011-2022, Christopher Jeffrey. (MIT License)] 修改

## 原理

```markdown
本题目我们可以使用 $dfs$ 解决。建边的话只用连 $u -> v$。**注意：** 要开long long 。
```

1. 将原来的 Markdown 拆分成各种 Tokens。
   - [Text Token] `本题目我们可以使用 `
   - [KaTeX Token] `$dfs$`
   - [Text Token] ` 解决。建边的话只用连 `
   - [KaTeX Token] `$u -> v$`
   - [Text Token] `。`
   - [Strong Text Token] `**注意：**`
   - [Text Token] ` 要开long long 。`
2. 对于每一个 Token 里的文字分别进行格式化。例如：
   - [KaTeX Token] `$dfs$` -> `dfs`
   - [KaTeX Token] `$u -> v$` -> `$u \to v$`
   - [Text Token] ` 要开long long 。` -> ` 要开 long long。`

   其中，文字 Token 的格式化流程是：

   1. 先删除所有需要删除的空格。规则参见 `src/formatRules.ts` 下的 `shouldRemoveSpace` 方法。大致是对于每一个空格，查看其左右两边的字符，并确认是否需要移除空格。例如：

        ```diff
        -  要开long long 。
        +  要开long long。
        ```

   2. 再确认需要添加空格的地方。同时确认是否需要将一个字符替换为全角。规则参见 `src/formatRules.ts` 下的 `shouldAddSpace`/`fullWidthReplaceRules`。只需确认任意两个字符之间是否需要添加空格。

        ```diff
        -  要开long long。
        +  要开 long long。
        ```

   3. 保险起见，最后再移除一次需要移除的空格。存在部分 corner case 在不进行这一步的情况下会出现期待之外的行为。

   实现在 `src/helpers.ts` 下的 `formatString`。

   KaTeX 的格式化流程是：

   1. 进行关键词匹配，例如 $dfs$ 一类。实现在 `src/Renderer.ts` 的 `_Renderer.katex` 和 `src/helpers.ts` 下的 `shouldForbidKatex`。规则参见 `src/formatRules.ts` 的 `forbidKatexRules`/`forbidKatexKeywords`/`forbidKatexKeywordsExactCase`。
   2. 对 KaTeX 内部文字进行正则表达式匹配并替换。规则参见 `src/formatRules.ts` 下的 `katexReplaceRules`。
   3. 由于是正则表达式的简单替换，因此会出现多余空格。因此最后会将多个空格替换为一个。

   实现在 `src/helpers.ts` 下的 `formatKatex`。

3. 拼接 Token，并对 Token 渲染结果进行增删空格、全半角替换等行为。实现在 `src/helpers.ts` 下的 `trimToken`。
4. 出结果。
