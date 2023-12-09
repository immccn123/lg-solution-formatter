# @imkdown/remark-lfm-fmt

`remark - luogu - flavor - markdown - format`

你可以通过这个 remark 插件来对 markdown AST 进行格式化，以满足[「洛谷主题库题解规范」](https://help.luogu.com.cn/rules/academic/solution-standard)。

You can use this remark plugin to format markdown AST to meet ["Solution Standard of Luogu Main Problem Set" (洛谷主题库题解规范)](https://help.luogu.com.cn/rules/academic/solution-standard).

建议同时启用 remark-math 插件。

It is recommended to enable the remark-math plugin.

例子 / Sample：

```js
const buf = fs.readFileSync("example.md");

const res = await remark()
  .use(remarkMath, { singleDollarTextMath: true })
  .use(remarkGfm)
  .use(remarkLfmFmt)
  .use(remarkStringify, { bullet: "-", rule: "-" })
  .process(buf);

console.log(String(res));
```
