import pangu from "pangu";
import {
  TO_HALF_WIDTH_BEGIN,
  isCJK,
  isCJKPunctuation,
  mathReplaceRules,
  toFullWidth,
  toFullWidthExtraRules,
} from "./rule.js";

/** @param {string} str */
export const removeDuplSpaces = (str) => str.replace(/ +/g, " ");

/**
 * @param {string} text
 */
export const formatText = (text) => {
  let res = pangu.spacing(removeDuplSpaces(text.trim()));

  toFullWidthExtraRules.forEach((rule) => {
    // @ts-ignore 有点搞不明白为什么这里必须针对 typeof rule.replace === "string" 条件分开写一样的东西
    res = res.replace(rule.pattern, rule.replace);
  });

  if (text.startsWith(" ")) res = " " + res;
  if (text.endsWith(" ")) res = res + " ";

  return res;
};

/** @param {string} tex */
export const formatMath = (tex) => {
  let res = tex.trim();

  mathReplaceRules.forEach((rule) => {
    // @ts-ignore 同上
    res = res.replace(rule.pattern, rule.replace);
  });

  res = removeDuplSpaces(res).trim();
  return res;
};

/**
 *
 * @param {string} left
 * @param {string} right
 * @param {boolean} [addExtraSpace]
 */
export const concatToken = (left, right, addExtraSpace = false) => {
  const tLeft = left.trimEnd(),
    tRight = right.trimStart();

  const leftEnd = tLeft[tLeft.length - 1],
    rightBegin = tRight[0];

  const isLeftTrimed = tLeft !== left,
    isRightTrimed = tRight !== right,
    isTrimed = isLeftTrimed || isRightTrimed;

  if (isCJKPunctuation(leftEnd) || isCJKPunctuation(rightBegin))
    return { left: tLeft, right: tRight, addSpace: false, addSpaceNext: false };

  // **好的**, 但是
  if (isCJK(leftEnd) && TO_HALF_WIDTH_BEGIN.test(tRight))
    return {
      left: tLeft,
      right: tRight.replace(TO_HALF_WIDTH_BEGIN, (match) =>
        toFullWidth(match.trim())
      ),
      addSpace: false,
      addSpaceNext: false,
    };

  if (isCJK(leftEnd) && isCJK(rightBegin))
    return {
      left: tLeft,
      right: tRight,
      addSpace: isTrimed || addExtraSpace,
      addSpaceNext: addExtraSpace ? false : isTrimed,
    };

  if (isCJK(leftEnd) !== isCJK(rightBegin))
    return { left: tLeft, right: tRight, addSpace: true, addSpaceNext: false };

  if (!isCJK(leftEnd) && !isCJK(rightBegin))
    return {
      left: tLeft,
      right: tRight,
      addSpace: isTrimed,
      addSpaceNext: false,
    };

  return { left, right, addSpace: false, addSpaceNext: false };
};
