/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
 * @typedef {import('vfile').VFile} VFile
 */

/// <reference types="mdast-util-math" />

import { concatToken, formatMath, formatText } from "./helper.js";
import { shouldAddSpace } from "./rule.js";

export default function remarkLfmFmt() {
  /** @param {RootContent} node */
  function findFirstDescendant(node) {
    if ("children" in node) {
      return findFirstDescendant(node.children[0]);
    }

    return node;
  }

  /** @param {RootContent} node */
  function findLastDescendant(node) {
    if ("children" in node) {
      return findLastDescendant(node.children[node.children.length - 1]);
    }

    return node;
  }

  /**
   * Format all the node in the syntax tree.
   *
   * @param {RootContent} node
   */
  function format(node) {
    switch (node.type) {
      // BlockContent for children
      case "blockquote":
      case "list":
      case "table":
      case "tableRow": {
        node.children.forEach(format);
        break;
      }

      case "delete":
      case "emphasis":
      case "heading":
      case "link":
      case "linkReference":
      case "listItem":
      case "paragraph":
      case "strong":
      case "tableCell": {
        let lastAddSpace = false;

        for (let i = 0; i < node.children.length; i++) {
          format(node.children[i]);

          if (i == 0) continue;

          const prevNode = findLastDescendant(node.children[i - 1]);
          const currNode = findFirstDescendant(node.children[i]);

          if (prevNode.type === "text") {
            if (currNode.type === "text") {
              const { left, right, addSpace, addSpaceNext } = concatToken(
                prevNode.value,
                currNode.value,
                lastAddSpace
              );
              prevNode.value = left;
              currNode.value = right;
              lastAddSpace = addSpaceNext;
              if (addSpace) {
                node.children.splice(i, 0, { type: "text", value: " " });
                i++;
              }
            } else if (
              currNode.type === "inlineMath" ||
              currNode.type === "inlineCode"
            ) {
              const prevStr = prevNode.value.trimEnd();
              const prevChar = prevStr[prevStr.length - 1];

              if (shouldAddSpace(prevChar, "A", prevStr !== prevNode.value)) {
                prevNode.value = prevStr + " ";
              } else {
                prevNode.value = prevStr;
              }
            }
          } else if (
            prevNode.type === "inlineMath" ||
            prevNode.type === "inlineCode"
          ) {
            if (currNode.type === "text") {
              const thisStr = currNode.value.trimStart();

              if (shouldAddSpace("A", thisStr[0], thisStr !== currNode.value)) {
                currNode.value = " " + thisStr;
              } else {
                currNode.value = thisStr;
              }
            }
          } else {
            lastAddSpace = false;
          }
        }

        break;
      }

      case "text": {
        node.value = formatText(node.value);
        break;
      }

      case "inlineMath":
      case "math": {
        node.value = formatMath(node.value);
        break;
      }

      // Do nothing.
      // case "yaml":
      // case "html":
      // case "code":
      // case "inlineCode":
      // case "break":
      // case "thematicBreak":
      // case "image":
      // case "imageReference":
      // case "definition":
      // case "footnoteDefinition":
      // case "footnoteReference":
    }
  }

  /**
   * The plugin.
   *
   * @param {Root} tree
   *   Tree.
   * @returns
   *   Nothing.
   */
  return (tree) => tree.children.forEach((x) => format(x));
}
