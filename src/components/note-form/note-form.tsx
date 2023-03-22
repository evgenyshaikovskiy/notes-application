import { useState } from "react";
import { Note } from "../../types";

// if editing the note, then provide note
// else creating the note
type NoteFormProps = {
  note?: Note;
};

interface FormErrors {
  hashtagError: string;
  contentError: string;
}

export const NoteForm = ({ note }: NoteFormProps) => {
  const [hashtagsInputValue, setHashtagsInputValue] = useState<string>(
    note ? note.hashtags.join(" ") : ""
  );

  const [noteContentValue, setNoteContentValue] = useState<string>(
    note ? note.content : ""
  );

  const [errors, setErrors] = useState<FormErrors>({
    hashtagError: "",
    contentError: "",
  });

  const validateHashtagInput = (hashtags: string) => {
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

  const validateContentInput = (content: string) => {
    if (!content) {
      return "Content is required to create the note.";
    }

    return "";
  };

  const handleHashtagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHashtagValue = e.target.value;
    setHashtagsInputValue(newHashtagValue);
    setErrors((prevState) => ({
      ...prevState,
      hashtagError: validateHashtagInput(newHashtagValue),
    }));
  };

  const handleContentTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContentValue = e.target.value;
    setNoteContentValue(newContentValue);
    setErrors((prevState) => ({
      ...prevState,
      contentError: validateContentInput(newContentValue),
    }));
  };

  const handleFormSubmit = () => {
    if (errors.contentError || errors.hashtagError) {
      return;
    }

    console.log("valid form");
  };

  return (
    <div className="note-form-wrapper">
      <div className="hashtag-input-wrapper">
        <input
          type="text"
          className="hashtag-input"
          placeholder="Provide hashtags for note"
          value={hashtagsInputValue}
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
          value={noteContentValue}
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
