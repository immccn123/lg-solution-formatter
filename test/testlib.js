const targetRegExp = (target) => {
  return RegExp(
    target
      .replaceAll("\\", "\\\\")
      .replaceAll("$", "\\$")
      .replaceAll(".", "\\.")
      .replaceAll("?", "\\?")
      .replaceAll("*", "\\*")
      .replaceAll("+", "\\+")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replaceAll("[", "\\[")
      .replaceAll("]", "\\]")
      .replaceAll("|", "\\|")
      .replaceAll("{", "\\{")
      .replaceAll("}", "\\}")
  );
};

module.exports = { targetRegExp };
