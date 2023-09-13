import { _Renderer } from "./Renderer.ts";
import { _TextRenderer } from "./TextRenderer.ts";
import { _defaults } from "./defaults.ts";
import { unescape, trimToken } from "./helpers.ts";
import type { Token, Tokens } from "./Tokens.ts";
import type { MarkedOptions } from "./MarkedOptions.ts";

/**
 * Parsing & Compiling
 */
export class _Parser {
  options: MarkedOptions;
  renderer: _Renderer;
  textRenderer: _TextRenderer;
  constructor(options?: MarkedOptions) {
    this.options = options || _defaults;
    this.options.renderer = this.options.renderer || new _Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new _TextRenderer();
  }

  /**
   * Static Parse Method
   */
  static parse(tokens: Token[], options?: MarkedOptions) {
    const parser = new _Parser(options);
    return parser.parse(tokens);
  }

  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens: Token[], options?: MarkedOptions) {
    const parser = new _Parser(options);
    return parser.parseInline(tokens);
  }

  /**
   * Parse Loop
   */
  parse(tokens: Token[], level = 1) {
    let mdText = "";

    // no trim.
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Run any renderer extensions
      if (
        this.options.extensions &&
        this.options.extensions.renderers &&
        this.options.extensions.renderers[token.type]
      ) {
        const genericToken = token as Tokens.Generic;
        const ret = this.options.extensions.renderers[genericToken.type].call(
          { parser: this },
          genericToken
        );
        if (
          ret !== false ||
          ![
            "space",
            "hr",
            "heading",
            "code",
            "table",
            "blockquote",
            "list",
            "html",
            "paragraph",
            "text",
          ].includes(genericToken.type)
        ) {
          mdText += ret || "";
          continue;
        }
      }

      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          mdText += this.renderer.hr();
          continue;
        }
        case "heading": {
          const headingToken = token as Tokens.Heading;
          mdText += this.renderer.heading(
            this.parseInline(headingToken.tokens).mdText,
            headingToken.depth,
            unescape(
              this.parseInline(headingToken.tokens, this.textRenderer).mdText
            )
          );
          continue;
        }
        case "code": {
          const codeToken = token as Tokens.Code;
          mdText += this.renderer.code(
            codeToken.text,
            codeToken.lang,
            !!codeToken.escaped
          );
          continue;
        }
        case "table": {
          // not impl yet

          const tableToken = token as Tokens.Table;
          mdText += tableToken.raw;
          continue;

          let header = "";

          // header
          let cell = "";
          for (let j = 0; j < tableToken.header.length; j++) {
            cell += this.renderer.tablecell(
              this.parseInline(tableToken.header[j].tokens).mdText,
              { header: true, align: tableToken.align[j] }
            );
          }
          header += this.renderer.tablerow(cell);

          let body = "";
          for (let j = 0; j < tableToken.rows.length; j++) {
            const row = tableToken.rows[j];

            cell = "";
            for (let k = 0; k < row.length; k++) {
              cell += this.renderer.tablecell(
                this.parseInline(row[k].tokens).mdText,
                {
                  header: false,
                  align: tableToken.align[k],
                }
              );
            }

            body += this.renderer.tablerow(cell);
          }
          mdText += this.renderer.table(header, body);
          continue;
        }
        case "blockquote": {
          const blockquoteToken = token as Tokens.Blockquote;
          const body = this.parse(blockquoteToken.tokens);
          mdText += this.renderer.blockquote(body.mdText);
          continue;
        }
        case "list": {
          const listToken = token as Tokens.List;
          const ordered = listToken.ordered;
          const loose = listToken.loose;

          let body = "";
          for (let j = 0; j < listToken.items.length; j++) {
            const item = listToken.items[j];
            const itemBody = this.parse(item.tokens, level + 1).mdText;
            body += this.renderer.listitem(
              itemBody,
              ordered ? j + 1 : undefined
            );
          }

          let rendered = this.renderer.list(body);
          if (level > 1) {
            let spaces = (ordered ? "   " : "  ").repeat(level - 1);
            rendered = "\n" + spaces + rendered.replace(/\n/g, "\n" + spaces);
          }
          mdText += rendered;
          continue;
        }
        case "html": {
          const htmlToken = token as Tokens.HTML;
          mdText += this.renderer.html(htmlToken.text, htmlToken.block);
          continue;
        }
        case "paragraph": {
          const paragraphToken = token as Tokens.Paragraph;
          mdText += this.renderer.paragraph(
            this.parseInline(paragraphToken.tokens).mdText
          );
          continue;
        }
        case "katexblock": {
          const katexToken = token as Tokens.KatexBlock;
          mdText +=
            this.renderer.katex(katexToken.text, katexToken.displayMode) + "\n";
          continue;
        }
        case "text": {
          let textToken = token as Tokens.Text;
          let body = textToken.tokens
            ? this.parseInline(textToken.tokens).mdText
            : textToken.text;
          while (i + 1 < tokens.length && tokens[i + 1].type === "text") {
            textToken = tokens[++i] as Tokens.Text;
            body +=
              "\n" +
              (textToken.tokens
                ? this.parseInline(textToken.tokens)
                : textToken.text);
          }
          mdText += level === 1 ? this.renderer.paragraph(body) : body;
          continue;
        }

        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return { mdText: "", displayText: "", isTrimed: false };
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }

    return { mdText, displayText: "", isTrimed: false };
  }

  /**
   * Parse Inline Tokens
   */
  parseInline(tokens: Token[], renderer?: _Renderer | _TextRenderer) {
    renderer = renderer || this.renderer;
    let mdText = "";
    let isTrimed: boolean = false;
    let displayText: string = "";

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Run any renderer extensions
      if (
        this.options.extensions &&
        this.options.extensions.renderers &&
        this.options.extensions.renderers[token.type]
      ) {
        const ret = this.options.extensions.renderers[token.type].call(
          { parser: this },
          token
        );
        if (
          ret !== false ||
          ![
            "escape",
            "html",
            "link",
            "image",
            "strong",
            "em",
            "codespan",
            "br",
            "del",
            "text",
          ].includes(token.type)
        ) {
          mdText += ret || "";
          continue;
        }
      }

      /**
       * Token 和 Token 之间的关系：
       * 中文标点 + 中文/英文/数字/公式 (allow reverse) = None
       * 中文 + 英文 (allow reverse) = Space
       *
       * 对于多个 Token 之间的格式化逻辑
       * 1. 移除上一个 Token 渲染末尾的所有空格（mdText 末尾空格），进行标记 (mdText.trimEnd())
       * 2. 移除这一个 Token 渲染开头的所有空格，进行标记
       * 3. 判断是否应该进行加空格
       *   - 前后都是非 CJK 字符并且存在删除空格，则添加
       *   - 其余按照 shouldAddSpace 进行处理
       */

      switch (token.type) {
        case "escape": {
          const escapeToken = token as Tokens.Escape;
          const renderedText = renderer.text(escapeToken.text);
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            renderedText,
            renderedText,
            isTrimed
          ));
          break;
        }
        case "html": {
          const tagToken = token as Tokens.Tag;
          mdText += renderer.html(tagToken.text);
          break;
        }
        case "link": {
          const linkToken = token as Tokens.Link;
          const linkChildText = this.parseInline(linkToken.tokens, renderer);
          const newMdText = renderer.link(
            linkToken.href,
            linkToken.title,
            linkChildText.mdText
          );
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            newMdText,
            linkChildText.displayText,
            isTrimed || linkChildText.isTrimed
          ));
          break;
        }
        case "image": {
          const imageToken = token as Tokens.Image;
          mdText += renderer.image(
            imageToken.href,
            imageToken.title,
            imageToken.text
          );
          break;
        }
        case "strong": {
          const strongToken = token as Tokens.Strong;
          const childText = this.parseInline(strongToken.tokens, renderer);
          const newMdText = renderer.strong(childText.mdText);
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            newMdText,
            childText.displayText,
            isTrimed || childText.isTrimed
          ));
          break;
        }
        case "em": {
          const emToken = token as Tokens.Em;
          const childText = this.parseInline(emToken.tokens, renderer);
          const newMdText = this.renderer.em(childText.mdText);
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            newMdText,
            childText.displayText,
            isTrimed || childText.isTrimed
          ));
          break;
        }
        case "codespan": {
          // enforce space
          const codespanToken = token as Tokens.Codespan;
          const newMdText = renderer.codespan(codespanToken.text);
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            newMdText,
            newMdText,
            isTrimed
          ));
          break;
        }
        case "br": {
          // no effect in inline mode
          mdText += renderer.br();
          break;
        }
        case "del": {
          const delToken = token as Tokens.Del;
          const childText = this.parseInline(delToken.tokens, renderer);
          const newMdText = renderer.del(childText.mdText);
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            newMdText,
            childText.displayText,
            isTrimed || childText.isTrimed
          ));
          break;
        }
        case "text": {
          const textToken = token as Tokens.Text;
          const renderedText = renderer.text(textToken.text);
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            renderedText,
            renderedText,
            isTrimed
          ));
          break;
        }
        case "katex": {
          const katexToken = token as Tokens.Katex;
          const renderedText = renderer.katex(
            katexToken.text,
            katexToken.displayMode
          );
          ({ mdText, displayText, isTrimed } = trimToken(
            mdText,
            displayText,
            renderedText,
            renderedText,
            isTrimed
          ));
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return { mdText: "", displayText: "", isTrimed: false };
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return {
      mdText,
      displayText: displayText.trim(),
      isTrimed: displayText !== displayText.trim(),
    };
  }
}
