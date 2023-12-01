/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
 */

/// <reference types="mdast-util-math" />

import { formatMath, formatText } from "./helper.js";

export default function remarkLfmFmt() {
  /** @param {RootContent} node */
  function findFirstDescendant(node) {
    if ("children" in node && node.children.length > 0) {
      return findFirstDescendant(node.children[0]);
    }

    return node;
  }

  /** @param {RootContent} node */
  function findLastDescendant(node) {
    if ("children" in node && node.children.length > 0) {
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
        node.children.forEach((child) => format(child));
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
        for (let i = 0; i < node.children.length; i++) {
          format(node.children[i]);
          // concat token
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
      case "yaml":
      case "html":
      case "code":
      case "inlineCode":
      case "break":
      case "thematicBreak":
      case "image":
      case "imageReference":
      case "definition":
      case "footnoteDefinition":
      case "footnoteReference":
        break;
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
  return (tree) => {
    tree.children.forEach((node) => format(node));
  };
}
