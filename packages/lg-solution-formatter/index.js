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
import remarkClangFmtWasm from "@imkdown/remark-clang-fmt-wasm";

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
    rem = rem.use(remarkClangFmtWasm, config.clang.config);
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
