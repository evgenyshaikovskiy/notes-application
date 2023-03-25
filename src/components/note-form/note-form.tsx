/* eslint-disable react/prop-types */
import "./note-form.styles.css";

import { useContext, useEffect, useState } from "react";
import { Note, NoteFormErrors } from "../../types";
import { HashtagComponent } from "../hashtag/hashtag.component";
import {
  validateContent,
  validateHashtags,
  getDistinctValues,
  parseHashtags,
  extractHashtag,
} from "../../utils";
import { StorageContext } from "../../contexts/storage.context";

// if editing the note, then provide note
// else creating the note
type NoteFormProps = {
  note?: Note;
  onSubmitCallback: () => void;
};

export const NoteForm = ({ note, onSubmitCallback }: NoteFormProps) => {
  // used contexts
  const { editNote, addNote } = useContext(StorageContext);

  // states
  const [hashtags, setHashtags] = useState<string>(
    note ? note.hashtags.join(" ") : ""
  );
  const [content, setContent] = useState<string>(note ? note.content : "");
  const [errors, setErrors] = useState<NoteFormErrors>({
    hashtagError: "",
    contentError: "",
  });

  const [isEditFinished, setIsEditFinished] = useState<boolean>(true);

  // handlers
  const handleContentChange = (content: string) => {
    setContent(content);
    setErrors((prevState) => ({
      ...prevState,
      contentError: validateContent(content),
    }));
  };

  const addNewHashtag = () => {
    setHashtags(hashtags !== "" ? hashtags.concat(" #") : "#");
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
    }, 2000);

    return () => clearTimeout(mergingDelayTimer);
  }, [content]);

  useEffect(() => {
    const hashtagValidationDelayTimer = setTimeout(() => {
      if (hashtags) {
        const hashtagError = validateHashtags(hashtags);
        if (hashtagError) {
          setErrors((prevState) => ({
            ...prevState,
            hashtagError: hashtagError,
          }));
        }
      }
    }, 100);

    return () => clearTimeout(hashtagValidationDelayTimer);
  }, [hashtags]);

  const formSubmit = (onSubmitCallback: () => void, note?: Note) => {
    if (!isEditFinished) {
      setErrors((prevState) => ({
        ...prevState,
        hashtagError: "Finish editing all hashtags before submitting.",
      }));
      return;
    }

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

  return (
    <div className="note-form-wrapper">
      <div className="hashtag-section-wrapper">
        <div className="hashtag-input-wrapper">
          {hashtags !== "" ? (
            hashtags
              .split(" ")
              .filter((h) => h !== "")
              .map((ht, idx) => (
                <HashtagComponent
                  initialHashtag={ht}
                  allHashtags={hashtags}
                  isActiveDefault={ht.length === 1 ? false : true}
                  setHashtags={setHashtags}
                  setEditIsFinished={setIsEditFinished}
                  key={idx}
                  setErrors={setErrors}
                />
              ))
          ) : (
            <></>
          )}
        </div>
        <div className="hashtag-section-actions">
          <i
            className="bi bi-plus-circle-fill icon"
            onClick={addNewHashtag}
          ></i>

          {errors.hashtagError && (
            <div className="tooltip">{errors.hashtagError}</div>
          )}
        </div>
      </div>

      <div className="content-textarea-wrapper">
        <div className="content-input-container">
          <input
            className="content-input"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
          ></input>

          <div className="content-renderer">
            {content.split(" ").map((word, idx) => {
              if (word.startsWith("#") && word !== "#") {
                const [ht, remainder] = extractHashtag(word);

                return (
                  <>
                    <span className="highlight" key={idx}>
                      {ht}
                    </span>
                    {remainder}{" "}
                  </>
                );
              } else {
                return word + " ";
              }
            })}
          </div>
        </div>
        {errors.contentError && (
          <div className="tooltip">{errors.contentError}</div>
        )}
      </div>

      <div className="submit-btn-wrapper">
        <button
          className="submit-btn"
          type="button"
          onClick={() => formSubmit(onSubmitCallback, note)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
