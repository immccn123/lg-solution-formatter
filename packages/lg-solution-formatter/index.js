import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import remarkLfmFmt from "@lfmfmt/remark-lfm-fmt/index.js";
import remarkGfm from "remark-gfm";

const solFmtUnified = unified()
  .use(remarkParse)
  .use(remarkMath, { singleDollarTextMath: true })
  .use(remarkGfm)
  .use(remarkLfmFmt)
  .use(remarkStringify, { bullet: "-", rule: "-" });

/**
 * @param {string} sourceStr
 */
const formatSolution = async (sourceStr) => {
  const file = await solFmtUnified.process(sourceStr);
  return String(file);
};

/**
 * @param {string} sourceStr
 */
const formatSolutionSync = (sourceStr) => {
  const file = solFmtUnified.processSync(sourceStr);
  return String(file);
};

export default formatSolution;
export { formatSolutionSync, formatSolution };
