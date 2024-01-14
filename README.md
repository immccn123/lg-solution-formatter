# 洛谷题解格式化器

使用方法：

访问 <https://tj.imken.dev/> 直接使用构建好的 WebApp。

## 原理

```markdown
本题目我们可以使用 $dfs$ 解决。建边的话只用连 $u -> v$。**注意：** 要开long long 。
```

1. 将原来的 Markdown 拆分成各种 Tokens 并建立 AST，这里利用 remark 生态进行处理。
   - [Text Token] `本题目我们可以使用 `
   - [Math Token] `$dfs$`
   - [Text Token] ` 解决。建边的话只用连 `
   - [Math Token] `$u -> v$`
   - [Text Token] `。`
   - [Strong] `**`
      - [Text Token] 注意：
   - [Text Token] ` 要开long long 。`
2. 使用深度优先搜索遍历 AST，对于每一个 Token 里的文字分别进行格式化。例如：
   - [Math Token] `$dfs$` -> `dfs`
   - [Math Token] `$u -> v$` -> `$u \to v$`
   - [Text Token] ` 要开long long 。` -> ` 要开 long long。`

   其中，文字 Token 的格式化直接用 [pangu.js](https://github.com/vinta/pangu.js/) 搞定。

   数学公式的格式化流程是：

   1. 对数学公式内部文字进行正则表达式匹配并替换。
   2. 由于是正则表达式的简单替换，因此会出现多余空格。因此最后会将多个空格替换为一个。

4. 拼接 Token，并对 Token 渲染结果进行增删空格、全半角替换等行为。
5. 使用 remark-stringify 从 AST 进行还原。

## 结构说明

1. 匹配规则的位置在 `packages/remark-lfm-fmt/src/lib/rule.js`；
2. AST 遍历的核心逻辑在 `packages/remark-lfm-fmt/src/lib/fmt.js`；
3. 文字 Token 的格式化逻辑在 `packages/remark-lfm-fmt/src/lib/helper.js` 的 `formatText` 方法，数学公式格式化在同文件的 `formatMath` 方法，Token 拼接在同文件的 `concatToken` 方法；
4. Token 拼接的逻辑比较复杂，有部分同样写在 `packages/remark-lfm-fmt/src/lib/fmt.js` 里面。

## 贡献

发现疏漏的话，可以来写点规则/改点逻辑啥的。核心代码逻辑应该不是很复杂，注意定位到出现疏漏的位置，例如是“文字 Token 内部格式化错误”或者“Token 拼接错误”。
