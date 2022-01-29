// stolen from strip-final-newline because they don't support require
exports.stripFinalNewline = (input) => {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();

  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }

  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }

  return input;
};
