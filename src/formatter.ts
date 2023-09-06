import { _Lexer } from './Lexer.ts';
import { _Parser } from './Parser.ts';
import { _Tokenizer } from './Tokenizer.ts';
import { _Renderer } from './Renderer.ts';
import { _TextRenderer } from './TextRenderer.ts';
import { _Hooks } from './Hooks.ts';
import { SolutionFormatter } from './Instance.ts';
import {
  _getDefaults,
  changeDefaults,
  _defaults
} from './defaults.ts';
import type { MarkedExtension, MarkedOptions } from './MarkedOptions.ts';
import type { Token, TokensList } from './Tokens.ts';
import type { MaybePromise } from './Instance.ts';

const markedInstance = new SolutionFormatter();

/**
 * Compiles markdown to HTML asynchronously.
 *
 * @param src String of markdown source to be compiled
 * @param options Hash of options, having async: true
 * @return Promise of string of compiled HTML
 */
export function solFormatter(src: string, options: MarkedOptions & { async: true }): Promise<string>;

/**
 * Compiles markdown to HTML synchronously.
 *
 * @param src String of markdown source to be compiled
 * @param options Optional hash of options
 * @return String of compiled HTML
 */
export function solFormatter(src: string, options?: MarkedOptions): string;
export function solFormatter(src: string, opt?: MarkedOptions): string | Promise<string> {
  return markedInstance.parse(src, opt);
}

/**
 * Sets the default options.
 *
 * @param options Hash of options
 */
solFormatter.options =
solFormatter.setOptions = function(options: MarkedOptions) {
  markedInstance.setOptions(options);
  solFormatter.defaults = markedInstance.defaults;
  changeDefaults(solFormatter.defaults);
  return solFormatter;
};

/**
 * Gets the original solFormatter default options.
 */
solFormatter.getDefaults = _getDefaults;

solFormatter.defaults = _defaults;

/**
 * Use Extension
 */

solFormatter.use = function(...args: MarkedExtension[]) {
  markedInstance.use(...args);
  solFormatter.defaults = markedInstance.defaults;
  changeDefaults(solFormatter.defaults);
  return solFormatter;
};

/**
 * Run callback for every token
 */

solFormatter.walkTokens = function(tokens: Token[] | TokensList, callback: (token: Token) => MaybePromise | MaybePromise[]) {
  return markedInstance.walkTokens(tokens, callback);
};

/**
 * Compiles markdown to HTML without enclosing `p` tag.
 *
 * @param src String of markdown source to be compiled
 * @param options Hash of options
 * @return String of compiled HTML
 */
solFormatter.parseInline = markedInstance.parseInline;

/**
 * Expose
 */
solFormatter.Parser = _Parser;
solFormatter.parser = _Parser.parse;
solFormatter.Renderer = _Renderer;
solFormatter.TextRenderer = _TextRenderer;
solFormatter.Lexer = _Lexer;
solFormatter.lexer = _Lexer.lex;
solFormatter.Tokenizer = _Tokenizer;
solFormatter.Hooks = _Hooks;
solFormatter.parse = solFormatter;

export const options = solFormatter.options;
export const setOptions = solFormatter.setOptions;
export const use = solFormatter.use;
export const walkTokens = solFormatter.walkTokens;
export const parseInline = solFormatter.parseInline;
export const parse = solFormatter;
export const parser = _Parser.parse;
export const lexer = _Lexer.lex;
export { _defaults as defaults, _getDefaults as getDefaults } from './defaults.ts';
export { _Lexer as Lexer } from './Lexer.ts';
export { _Parser as Parser } from './Parser.ts';
export { _Tokenizer as Tokenizer } from './Tokenizer.ts';
export { _Renderer as Renderer } from './Renderer.ts';
export { _TextRenderer as TextRenderer } from './TextRenderer.ts';
export { _Hooks as Hooks } from './Hooks.ts';
export { SolutionFormatter } from './Instance.ts';
export type * from './MarkedOptions.ts';
export type * from './matchRules.ts';
export type * from './Tokens.ts';
