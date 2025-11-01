import {
  TO_HW_BEGIN,
  fwPunctuationToHw,
  isCjk,
  isCjkPunctuation,
  mathReplaceRules,
  punctuationCjkToFw,
  textPostprocessRules,
  textPreprocessRules,
  toFw,
  toFwExtraRules,
} from "./rule.js";
import pangu from "pangu";

/** @param {string} str */
export const removeDuplSpaces = (str) => str.replace(/ +/g, " ");

/**
 * @param {string} text
 * @param {boolean} fwPunctuation
 */
export const formatText = (text, fwPunctuation) => {
  let res = pangu.spacingText(removeDuplSpaces(text.trim()));

  textPreprocessRules.forEach((rule) => {
    // @ts-expect-error 有点搞不明白为什么这里必须针对 typeof rule.replace === "string" 条件分开写一样的东西
    res = res.replace(rule.pattern, rule.replace);
  });

  if (fwPunctuation) {
    toFwExtraRules.forEach((rule) => {
      // @ts-expect-error 同上
      res = res.replace(rule.pattern, rule.replace);
    });
    res = punctuationCjkToFw(res);
  } else {
    let flag = text.endsWith(" ");
    res = fwPunctuationToHw(res);
    if (!flag) res = res.trimEnd();
  }

  textPostprocessRules.forEach((rule) => {
    // @ts-expect-error
    res = res.replace(rule.pattern, rule.replace);
  });

  if (text.startsWith(" ")) res = " " + res;
  if (text.endsWith(" ")) res = res + " ";

  return res;
};

/**
 * @param {string} tex
 * @param {import("./rule.js").MathFormatRules[]} enabledRules
 */
export const formatMath = (tex, enabledRules) => {
  let res = tex.trim();

  enabledRules.forEach((ruleId) => {
    const rule = mathReplaceRules[ruleId];
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

  if (isCjkPunctuation(leftEnd) || isCjkPunctuation(rightBegin))
    return { left: tLeft, right: tRight, addSpace: false, addSpaceNext: false };

  // **好的**, 但是
  if (isCjk(leftEnd) && TO_HW_BEGIN.test(tRight))
    return {
      left: tLeft,
      right: tRight.replace(TO_HW_BEGIN, (match) => toFw(match.trim())),
      addSpace: false,
      addSpaceNext: false,
    };

  if (isCjk(leftEnd) && isCjk(rightBegin))
    return {
      left: tLeft,
      right: tRight,
      addSpace: isTrimed || addExtraSpace,
      addSpaceNext: addExtraSpace ? false : isTrimed,
    };

  if (isCjk(leftEnd) !== isCjk(rightBegin))
    return { left: tLeft, right: tRight, addSpace: true, addSpaceNext: false };

  if (!isCjk(leftEnd) && !isCjk(rightBegin))
    return {
      left: tLeft,
      right: tRight,
      addSpace: isTrimed,
      addSpaceNext: false,
    };

  return { left, right, addSpace: false, addSpaceNext: false };
};
