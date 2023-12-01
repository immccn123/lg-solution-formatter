import pangu from "pangu";
import { katexReplaceRules } from "./rule.js";

/** @param {string} str */
export const removeDuplSpaces = (str) => str.replace(/ +/g, " ");

/** @param {string} text */
export const formatText = (text) => {
  let res = pangu.spacing(removeDuplSpaces(text).trim());

  if (text.startsWith(" ")) res = " " + res;
  if (text.endsWith(" ")) res = res + " ";

  return res;
};

/** @param {string} tex */
export const formatMath = (tex) => {
  let res = tex.trim();
  katexReplaceRules.forEach((rule) => {
    // 为什么必须要用这么阴间的写法
    if (typeof rule.target === "string") {
      res = res.replace(rule.pattern, rule.target);
    } else {
      res = res.replace(rule.pattern, rule.target);
    }
  });
  res = removeDuplSpaces(res).trim()
  return res;
};
