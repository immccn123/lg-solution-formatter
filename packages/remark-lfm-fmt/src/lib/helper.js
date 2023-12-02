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

/** @param {string} str */
export const replaceThreeDots = (str) =>
  str.replace(/\.{3,}/g, (match) =>
    "…".repeat(Math.min(Math.ceil(match.length / 3), 2))
  );

/** @param {string} text */
export const formatText = (text) => {
  let res = text.trim();

  res = replaceThreeDots(res);
  res = removeDuplSpaces(res);
  res = pangu.spacing(res);

  toFullWidthExtraRules.forEach((rule) => {
    if (typeof rule.replace === "string") {
      res = res.replace(rule.pattern, rule.replace);
    } else {
      res = res.replace(rule.pattern, rule.replace);
    }
  });

  if (text.startsWith(" ")) res = " " + res;
  if (text.endsWith(" ")) res = res + " ";

  return res;
};

/** @param {string} tex */
export const formatMath = (tex) => {
  let res = tex.trim();
  mathReplaceRules.forEach((rule) => {
    // 为什么必须要用这么阴间的写法
    if (typeof rule.replace === "string") {
      res = res.replace(rule.pattern, rule.replace);
    } else {
      res = res.replace(rule.pattern, rule.replace);
    }
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

  const leftLast = tLeft[tLeft.length - 1],
    rightFirst = tRight[0];

  const isLeftTrimed = tLeft !== left,
    isRightTrimed = tRight !== right,
    isTrimed = isLeftTrimed || isRightTrimed;

  if (isCJKPunctuation(leftLast) || isCJKPunctuation(rightFirst))
    return { left: tLeft, right: tRight, addSpace: false, addSpaceNext: false };

  // **好的**, 但是
  // 中文**, 但是**
  if (isCJK(leftLast) && TO_HALF_WIDTH_BEGIN.test(tRight))
    return {
      left: tLeft,
      right: tRight.replace(TO_HALF_WIDTH_BEGIN, (match) =>
        toFullWidth(match.trim())
      ),
      addSpace: false,
      addSpaceNext: false,
    };

  if (isCJK(leftLast) && isCJK(rightFirst))
    return {
      left: tLeft,
      right: tRight,
      addSpace: addExtraSpace,
      addSpaceNext: addExtraSpace ? false : isTrimed,
    };

  if (isCJK(leftLast) !== isCJK(rightFirst))
    return { left: tLeft, right: tRight, addSpace: true, addSpaceNext: false };

  if (!isCJK(leftLast) && !isCJK(rightFirst))
    return {
      left: tLeft,
      right: tRight,
      addSpace: isTrimed,
      addSpaceNext: false,
    };

  return { left, right, addSpace: false, addSpaceNext: false };
};
