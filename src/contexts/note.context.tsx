/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Note, NoteFormContextType, NoteFormErrors } from "../types";
import { getDistinctValues, parseHashtags } from "../utils";
import { StorageContext } from "./storage.context";

export const NoteFormContext = createContext<NoteFormContextType>({
  hashtags: "",
  content: "",
  formErrors: { hashtagError: "", contentError: "" },
  setContent: () => {},
  setHashtags: () => {},
  onFormSubmit: () => {},
});

export const NoteFormContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hashtags, setHashtags] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [errors, setErrors] = useState<NoteFormErrors>({
    hashtagError: "",
    contentError: "",
  });

  const { editNote, addNote } = useContext(StorageContext);

  // handlers
  const handleContentChange = (content: string) => {
    setContent(content);
    setErrors((prevState) => ({
      ...prevState,
      contentError: validateContent(content),
    }));
  };

  const handleHashtagsChange = (hashtags: string) => {
    setHashtags(hashtags);
    setErrors((prevState) => ({
      ...prevState,
      hashtagError: validateHashtags(hashtags),
    }));
  };

  // validators
  const validateContent = (content: string) => {
    if (!content) {
      return "Content is required to create the note.";
    }

    return "";
  };

  const validateHashtags = (hashtags: string) => {
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
      return `Please, do not create empty hashtags.`;
    }

    return "";
  };

  // utility
  const mergeHashtagsFromContent = () => {
    if (content) {
      const newHashtagValue = mergeHashtags();
      setHashtags(newHashtagValue);
      setErrors((prevState) => ({
        ...prevState,
        hashtagError: validateHashtags(newHashtagValue),
      }));
    }
  };

  const mergeHashtags = () =>
    getDistinctValues(hashtags.split(" ").concat(parseHashtags(content))).join(
      " "
    );

  // merging tags from content input to hashtag input
  useEffect(() => {
    const mergingDelayTimer = setTimeout(() => {
      mergeHashtagsFromContent();
    }, 3000);

    return () => clearTimeout(mergingDelayTimer);
  }, [content]);

  const formSubmit = (onSubmitCallback: () => void, note?: Note) => {
    const actualHashtagValue = mergeHashtags();
    const contentError = validateContent(content);
    const hashtagError = validateHashtags(actualHashtagValue);
    if (contentError || hashtagError) {
      setErrors(() => ({
        hashtagError: hashtagError,
        contentError: contentError,
      }));
      return;
    }

    if (note) {
      // edit flow
      editNote({
        content: content,
        hashtags: actualHashtagValue.split(" "),
        id: note.id,
      });
    } else {
      // create flow
      addNote(content, actualHashtagValue.split(" "));
      setHashtags("");
      setContent("");
    }

    onSubmitCallback();
  };

  const value = {
    hashtags: hashtags,
    content: content,
    formErrors: errors,
    setContent: handleContentChange,
    setHashtags: handleHashtagsChange,
    onFormSubmit: formSubmit,
  };

  return (
    <NoteFormContext.Provider value={value}>
      {children}
    </NoteFormContext.Provider>
  );
};
