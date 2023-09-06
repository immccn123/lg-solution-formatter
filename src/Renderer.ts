import { _defaults } from "./defaults.ts";
import { cleanUrl, formatString } from "./helpers.ts";
import type { MarkedOptions } from "./MarkedOptions.ts";

/**
 * Renderer
 */
export class _Renderer {
  options: MarkedOptions;
  constructor(options?: MarkedOptions) {
    this.options = options || _defaults;
  }

  code(
    code: string,
    infostring: string | undefined,
    escaped?: boolean
  ): string {
    const lang = (infostring || "").match(/^\S*/)?.[0];

    code = code.replace(/\n$/, "") + "\n";

    return "```" + lang + "\n" + code + "```\n\n";
  }

  blockquote(quote: string): string {
    return "> " + quote.replaceAll("\n", "\n> ").slice(0, -2);
  }

  html = (html: string, block?: boolean) => html;

  heading(text: string, level: number, raw: string): string {
    return `${"#".repeat(level)} ${text}\n\n`;
  }

  hr = () => "---\n";

  list = (body: string): string => body + "\n";

  listitem(text: string, orderId?: number): string {
    if (orderId) {
      return `${orderId}. ${text}\n`;
    }
    return `- ${text}\n`;
  }

  paragraph = (text: string) => `${text}\n\n`;

  table(header: string, body: string): string {
    if (body) body = `<tbody>${body}</tbody>`;

    return (
      "<table>\n" + "<thead>\n" + header + "</thead>\n" + body + "</table>\n"
    );
  }

  tablerow(content: string): string {
    return `<tr>\n${content}</tr>\n`;
  }

  tablecell(
    content: string,
    flags: {
      header: boolean;
      align: "center" | "left" | "right" | null;
    }
  ): string {
    const type = flags.header ? "th" : "td";
    const tag = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
    return tag + content + `</${type}>\n`;
  }

  /**
   * span level renderer
   */
  strong(text: string): string {
    return `**${text}**`;
  }

  em(text: string): string {
    return `*${text}*`;
  }

  codespan(text: string): string {
    return `\`${text}\``;
  }

  br(): string {
    return "  \n";
  }

  del(text: string): string {
    return `~~${formatString(text)}~~`;
  }

  link(href: string, title: string | null | undefined, text: string): string {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    const out = `[${formatString(text)}](${href}${
      title ? '"' + formatString(title) + '"' : ""
    })`;
    return out;
  }

  image(href: string, title: string | null, text: string): string {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;

    let out = `![${text}](${href}`;
    if (title) {
      out += ` "${title}"`;
    }
    out += ")";
    return out;
  }

  katex(text: string, displayMode: boolean): string {
    const cover = displayMode ? "$$" : "$";
    return (
      cover +
      (displayMode ? "\n" : " ") +
      text.replace(/\*/g, "\\times") +
      (displayMode ? "\n" : " ") +
      cover
    );
  }

  text(text: string): string {
    return formatString(text);
  }
}
