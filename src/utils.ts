// second filter in case text contains distinct hashtags
export const parseHashtags = (text: string): string[] =>
  text
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.startsWith("#"))
    .filter((hashtags) => hashtags.length > 1)
    .map((hashtag) => extractHashtag(hashtag)[0]);

export const extractHashtag = (inputString: string): [string, string] => {
  const match = inputString.match(/^(#[a-zA-Z0-9]+)(.*)$/);
  const before = match ? match[1] : "";
  const after = match ? match[2] : "";
  return [before, after];
};

export const getDistinctValues = (array: string[]) => {
  console.log(array, "here");
  const copy = array.concat();
  for (let i = 0; i < copy.length; ++i) {
    for (let j = i + 1; j < copy.length; ++j) {
      if (copy[i] === copy[j] && copy[i].length !== 1) {
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

export const validateHashtag = (hashtag: string): string => {
  if (!hashtag || hashtag.length < 2) {
    return "Hashtag cannot be empty.";
  } else if (!hashtag.startsWith("#")) {
    return `Hashtag must start within '#' symbol.`;
  } else if (hashtag.split(" ").length > 1) {
    return "Hashtag cannot contain whitespace.";
  }

  return "";
};

export const validateHashtags = (hashtags: string[]): string => {
  if (hashtags.length === 0) {
    return "Hashtags are required to create the note.";
  }

  const errors = hashtags
    .map((ht) => validateHashtag(ht))
    .filter((v) => v !== "");
  return errors.length > 0 ? errors[0] : "";
};

// also possible
// export const parseHashtagsRegularExpression = (text: string): string[] => {
//   const regex = /#\w+/g;
//   const matches = text.match(regex);
//   if (!matches) return [];
//   return matches;
// };
