// second filter in case text contains distinct hashtags
export const parseHashtags = (text: string): string[] =>
  text
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.startsWith("#"))
    .filter((hashtags) => hashtags.length > 1);


export const getDistinctValues = (array: string[]) => {
  const copy = array.concat();
  for (let i = 0; i < copy.length; ++i) {
    for (let j = i + 1; j < copy.length; ++j) {
      if (copy[i] === copy[j]) {
        copy.splice(j--, 1);
      }
    }
  }

  return copy;
}

// also possible
// export const parseHashtagsRegularExpression = (text: string): string[] => {
//   const regex = /#\w+/g;
//   const matches = text.match(regex);
//   if (!matches) return [];
//   return matches;
// };
