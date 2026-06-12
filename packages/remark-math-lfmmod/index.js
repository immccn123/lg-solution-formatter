/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
 * @typedef {import('vfile').VFile} VFile
 */

/// <reference types="mdast-util-math" />

import { visit } from "unist-util-visit";

export default function remarkMathLfmmod() {
  /**
   * The plugin.
   *
   * @param {Root} tree
   * @param {VFile} file
   * @returns
   *   Nothing.
   */

  return (tree, file) => {
    const rawDoc = file.value;

    visit(tree, "paragraph", (node, index, parent) => {
      if (
        node.children.length === 1 &&
        node.children[0]?.type === "inlineMath"
      ) {
        const mathValue = node.children[0].value;

        const mathNode = {
          ...node.children[0],
          type: /** @type {const} */ ("math"),
          value: mathValue,
        };

        if (parent && typeof index === "number") parent.children[index] = mathNode;
      }
    });

    /**
     * @type {{
     *   parent: import("mdast").Parents,
     *   index: number,
     *   paragraphNode: import("mdast").RootContent
     * }[]}
     */
    const patches = [];

    visit(tree, "math", (node, index, parent) => {
      if (node.position && parent && typeof index === "number") {
        const startIdx = node.position.start.offset;
        const endIdx = node.position.end.offset;
        const originalText = /** @type {string} */ (
          rawDoc.slice(startIdx, endIdx)
        ).trim();

        if (!originalText.startsWith("$$")) {
          const inlineMathNode = {
            type: /** @type {const} */ ("inlineMath"),
            value: node.value,
          };

          const paragraphNode = {
            type: /** @type {const} */ ("paragraph"),
            children: [inlineMathNode],
          };

          patches.push({ parent, index, paragraphNode });
        }
      }
    });

    patches.reverse();

    for (const { parent, index, paragraphNode } of patches) {
      parent.children[index] = paragraphNode;
    }
  };
}
