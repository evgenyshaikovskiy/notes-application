/* eslint-disable react/prop-types */
import "./note-form.styles.css";

import { useContext, useEffect, useState } from "react";
import { HashtagState, Note, NoteFormErrors } from "../../types";
import { HashtagComponent } from "../hashtag/hashtag.component";
import {
  validateContent,
  validateHashtags,
  getDistinctValues,
  parseHashtags,
  extractHashtag,
} from "../../utils";
import { StorageContext } from "../../contexts/storage.context";

import { ReactComponent as PlusIcon } from "./../../assets/plus-icon.svg";

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
  const [hashtags, setHashtags] = useState<HashtagState[]>(
    note
      ? note.hashtags.map((ht) => {
          return { hashtag: ht, isBlocked: true };
        })
      : []
  );

  const [content, setContent] = useState<string>(note ? note.content : "");
  const [errors, setErrors] = useState<NoteFormErrors>({
    hashtagError: "",
    contentError: "",
  });

  // handlers
  const handleContentChange = (content: string) => {
    setContent(content);
    setErrors((prevState) => ({
      ...prevState,
      contentError: validateContent(content),
    }));
  };

  const addNewHashtag = () => {
    setHashtags([...hashtags, { hashtag: "#", isBlocked: false }]);
  };

  // utility
  const mergeHashtagsFromContent = () => {
    if (content) {
      const newHashtags = mergeHashtags();
      setHashtags([
        ...newHashtags.map((ht) => {
          const oldHt = hashtags.find((state) => state.hashtag === ht);
          if (oldHt) {
            return oldHt;
          } else {
            return { hashtag: ht, isBlocked: true };
          }
        }),
      ]);
      setErrors((prevState) => ({
        ...prevState,
        hashtagError: validateHashtags(newHashtags),
      }));
    }
  };

  const mergeHashtags = () =>
    getDistinctValues(
      hashtags.map((state) => state.hashtag).concat(parseHashtags(content))
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
        const hashtagError = validateHashtags(hashtags.map((st) => st.hashtag));
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
    if (!hashtags.every((state) => state.isBlocked)) {
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
        hashtags: actualHashtagValue,
        id: note.id,
      });
    } else {
      // create flow
      addNote(content, actualHashtagValue);
      setHashtags([]);
      setContent("");
    }

    onSubmitCallback();
  };

  return (
    <div className="note-form-wrapper">
      <div className="hashtag-section-wrapper">
        {hashtags ? (
          <div className="hashtag-input-wrapper">
            {hashtags.map((state, idx) => (
              <HashtagComponent
                initialHashtagValue={state.hashtag}
                currentState={state}
                allHashtags={hashtags}
                setHashtags={setHashtags}
                key={idx}
                setErrors={setErrors}
              />
            ))}
          </div>
        ) : (
          <div className="empty-hashtags-section-text">
            To add hashtags click on icon below
          </div>
        )}
        <div className="hashtag-section-actions">
          <PlusIcon
            className="icon add-hashtag-icon"
            onClick={addNewHashtag}
          ></PlusIcon>

          {errors.hashtagError && (
            <div className="tooltip">{errors.hashtagError}</div>
          )}
        </div>
      </div>

      <div className="content-textarea-wrapper">
        <div className="content-input-title">Type note text in box below.</div>
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
          className="submit-btn btn"
          type="button"
          onClick={() => formSubmit(onSubmitCallback, note)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
