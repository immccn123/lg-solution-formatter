/// <reference path="./vite.d.ts" />

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
 * @typedef {import('vfile').VFile} VFile
 */

import init, { format } from "@wasm-fmt/clang-format/clang-format-vite.js";
import { visit } from "unist-util-visit";

/**
 * @param {string} config
 */
export default function remarkClangFmtWasm(config = "WebKit") {
  /**
   * The plugin.
   *
   * @param {Root} tree
   *   Tree.
   * @returns
   *   Nothing.
   */
  return async (tree) => {
    await init();

    visit(tree, "code", (node) => {
      if (node.lang === "cpp" || node.lang === "c++") {
        node.value = format(node.value, "main.cc", config);
      } else if (node.lang === "c") {
        node.value = format(node.value, "main.c", config);
      }
    });
  };
}
