// second filter in case text contains distinct hashtags
export const parseHashtags = (text: string): string[] =>
  text
    .split(" ")
    .filter((word) => word.startsWith("#"))
    .filter((hashtags) => hashtags.length > 1);

// also possible
// export const parseHashtagsRegularExpression = (text: string): string[] => {
//   const regex = /#\w+/g;
//   const matches = text.match(regex);
//   if (!matches) return [];
//   return matches;
// };
