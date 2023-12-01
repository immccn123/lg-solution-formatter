import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import remarkLfmFmt from "../remark-lfm-fmt/index.js";

const solFmtUnified = unified()
  .use(remarkParse)
  .use(remarkMath, { singleDollarTextMath: true })
  .use(remarkLfmFmt)
  .use(remarkStringify, { bullet: "-" });

/**
 * @param {string} sourceStr
 */
const solutionFormat = async (sourceStr) => {
  const file = await solFmtUnified.process(sourceStr);
  return String(file);
};

/**
 * @param {string} sourceStr
 */
const solutionFormatSync = (sourceStr) => {
  const file = solFmtUnified.processSync(sourceStr);
  return String(file);
};

export default solutionFormat;
export { solutionFormatSync, solutionFormat };
