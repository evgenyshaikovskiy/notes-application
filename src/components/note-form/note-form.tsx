import { useContext, useEffect, useState } from "react";
import { Note } from "../../types";
import { getDistinctValues, parseHashtags } from "../../utils";
import { StorageContext } from "../../contexts/storage-provider";

// if editing the note, then provide note
// else creating the note
type NoteFormProps = {
  note?: Note;
  onSubmitCallback: () => void;
};

interface FormErrors {
  hashtagError: string;
  contentError: string;
}

export const NoteForm = ({ note, onSubmitCallback }: NoteFormProps) => {
  const { addNote, editNote } = useContext(StorageContext);

  const [hashtags, setHashtags] = useState<string>(
    note ? note.hashtags.join(" ") : ""
  );

  const [content, setContent] = useState<string>(
    note ? note.content : ""
  );

  const [errors, setErrors] = useState<FormErrors>({
    hashtagError: "",
    contentError: "",
  });

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

  const validateContents = (content: string) => {
    if (!content) {
      return "Content is required to create the note.";
    }

    return "";
  };

  const handleHashtagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHashtagValue = e.target.value;
    setHashtags(newHashtagValue);
    setErrors((prevState) => ({
      ...prevState,
      hashtagError: validateHashtags(newHashtagValue),
    }));
  };

  const handleContentTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContent = e.target.value;
    setContent(newContent);
    setErrors((prevState) => ({
      ...prevState,
      contentError: validateContents(newContent),
    }));
  };

  const handleFormSubmit = () => {
    if (errors.contentError || errors.hashtagError) {
      return;
    }

    mergeHashtagsFromContent();

    if (note) {
      // edit flow
      editNote({
        content: content,
        hashtags: hashtags.split(" "),
        id: note.id,
      });
    } else {
      // create flow
      addNote(content, hashtags.split(" "));
      setHashtags('');
      setContent('');
    }

    onSubmitCallback();
  };

  const mergeHashtagsFromContent = () => {
    if (content) {
      const newHashtagValue = getDistinctValues(
        hashtags.split(" ").concat(parseHashtags(content))
      ).join(" ");
      setContent(newHashtagValue);
      setErrors((prevState) => ({
        ...prevState,
        hashtagError: validateHashtags(newHashtagValue),
      }));
    }
  };

  // merging tags from content input to hashtag input
  useEffect(() => {
    const mergingDelayTimer = setTimeout(() => {
      mergeHashtagsFromContent();
    }, 3000);

    return () => clearTimeout(mergingDelayTimer);
  }, [content]);

  return (
    <div className="note-form-wrapper">
      <div className="hashtag-input-wrapper">
        <input
          type="text"
          className="hashtag-input"
          placeholder="Provide hashtags for note"
          value={hashtags}
          onChange={handleHashtagInputChange}
        ></input>

        {errors.hashtagError && (
          <div className="tooltip">{errors.hashtagError}</div>
        )}
      </div>

      <div className="content-textarea-wrapper">
        <textarea
          className="content-textarea"
          placeholder="Provide text for note"
          value={content}
          onChange={handleContentTextareaChange}
        ></textarea>
        {errors.contentError && (
          <div className="tooltip">{errors.contentError}</div>
        )}
      </div>

      <div className="submit-btn-wrapper">
        <button className="submit-btn" type="button" onClick={handleFormSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
