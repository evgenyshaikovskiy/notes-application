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
};

// validators
export const validateContent = (content: string) => {
  if (!content) {
    return "Content is required to create the note.";
  }

  return "";
};

export const validateHashtag = (hashtag: string) => {
  if (!hashtag || hashtag.length < 2) {
    return "Hashtag cannot be empty.";
  } else if (!hashtag.startsWith("#")) {
    return `Hashtag must start within '#' symbol.`;
  } else if (hashtag.split(" ").length > 1) {
    return "Hashtag cannot contain whitespace.";
  }

  return "";
};

export const validateHashtags = (hashtags: string) => {
  if (!hashtags) {
    return "Hashtags are required to create the note.";
  } else if (
    !hashtags
      .split(" ")
      .filter((word) => word.length !== 0)
      .every((word) => word.startsWith("#"))
  ) {
    return `Please, make sure that every hashtag has '#' before.`;
  } else if (
    !hashtags
      .split(" ")
      .filter((word) => word.length !== 0)
      .every((word) => word.length > 1)
  ) {
    return "";
    // return `Please, do not create empty hashtags.`;
  }

  return "";
};

// also possible
// export const parseHashtagsRegularExpression = (text: string): string[] => {
//   const regex = /#\w+/g;
//   const matches = text.match(regex);
//   if (!matches) return [];
//   return matches;
// };
