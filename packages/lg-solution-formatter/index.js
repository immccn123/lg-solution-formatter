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

const solFmtRemark = remark()
  .use(remarkMath, { singleDollarTextMath: true })
  .use(remarkGfm)
  .use(remarkLfmFmt)
  .use(remarkStringify, { bullet: "-", rule: "-" });

/**
 * @param {string} sourceStr
 */
const formatSolution = async (sourceStr) => {
  const file = await solFmtRemark.process(sourceStr);
  return String(file);
};

/**
 * @param {string} sourceStr
 */
const formatSolutionSync = (sourceStr) => {
  const file = solFmtRemark.processSync(sourceStr);
  return String(file);
};

export default formatSolution;
export { formatSolutionSync, formatSolution };
