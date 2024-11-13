/// <reference types="vite/client" />

/**
 * @imkdown/lg-solution-formatter
 * ---
 * @author Imken Luo <me@imken.moe> (https://imken.moe)
 * @license MIT
 * @homepage https://github.com/immccn123/lg-solution-formatter
 */

import { remark } from "remark";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import remarkLfmFmt from "@imkdown/remark-lfm-fmt";
import remarkGfm from "remark-gfm";

/**
 * @typedef {{
 *   clang?: {
 *     enabled?: boolean,
 *     config?: string
 *   }
 *  }} Config
 */

/**
 * @param {string} sourceStr
 * @param {Config} config
 */
const formatSolution = async (sourceStr, config = {}) => {
  let rem = remark()
    .use(remarkMath, { singleDollarTextMath: true })
    .use(remarkGfm)
    .use(remarkLfmFmt)
    .use(remarkStringify, { bullet: "-", rule: "-" });

  if (config.clang?.enabled) {
    if (import.meta.env) {
      const vitePlugin = await import("@imkdown/remark-clang-fmt-wasm/vite.js");
      rem = rem.use(vitePlugin.default, config.clang.config);
    } else {
      const nodePlugin = await import("@imkdown/remark-clang-fmt-wasm/node.js");
      rem = rem.use(nodePlugin.default, config.clang.config);
    }
  }

  const file = await rem.process(sourceStr);
  return String(file);
};

/**
 * clang-format is not supported.
 *
 * @param {string} sourceStr
 */
const formatSolutionSync = (sourceStr) => {
  const file = remark()
    .use(remarkMath, { singleDollarTextMath: true })
    .use(remarkGfm)
    .use(remarkLfmFmt)
    .use(remarkStringify, { bullet: "-", rule: "-" })
    .processSync(sourceStr);
  return String(file);
};

export default formatSolution;
export { formatSolutionSync, formatSolution };
