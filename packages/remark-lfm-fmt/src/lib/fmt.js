/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').RootContent} RootContent
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
        let lastAddSpace = false;

        for (let i = 0; i < node.children.length; i++) {
          format(node.children[i]);

          if (i == 0) continue;

          const lastNode = findLastDescendant(node.children[i - 1]);
          const thisNode = findFirstDescendant(node.children[i]);
          switch (lastNode.type) {
            case "text": {
              if (thisNode.type === "text") {
                const { left, right, addSpace, addSpaceNext } = concatToken(
                  lastNode.value,
                  thisNode.value,
                  lastAddSpace
                );
                lastNode.value = left;
                thisNode.value = right;
                lastAddSpace = addSpaceNext;
                if (addSpace) {
                  // @ts-ignore
                  node.children = [
                    ...node.children.slice(0, i),
                    { type: "text", value: " " },
                    ...node.children.slice(i),
                  ];
                  i++;
                }
              } else if (thisNode.type === "inlineMath" || thisNode.type === "inlineCode") {
                const lastStr = thisNode.value.trimEnd();
                if (shouldAddSpace(lastStr[lastStr.length - 1], "A")) {
                  lastNode.value = lastStr + " ";
                } else {
                  thisNode.value = lastStr;
                }
              }
              break;
            }
            case "inlineMath":
            case "inlineCode": {
              if (thisNode.type === "text") {
                if (shouldAddSpace("A", thisNode.value.trimStart()[0])) {
                  thisNode.value = " " + thisNode.value.trimStart();
                } else {
                  thisNode.value = thisNode.value.trimStart();
                }
              }
              break;
            }

            default:
              lastAddSpace = false;
              break;
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
