import React, { useState } from "react";

import "./hashtag.styles.css";
import { validateHashtag } from "../../utils";
import { HashtagState, NoteFormErrors } from "../../types";

type HashtagComponentProps = {
  initialHashtagValue: string;
  currentState: HashtagState;
  allHashtags: HashtagState[];
  setHashtags: (value: HashtagState[]) => void;
  setErrors: React.Dispatch<React.SetStateAction<NoteFormErrors>>;
};

export const HashtagComponent = ({
  currentState,
  initialHashtagValue,
  allHashtags,
  setHashtags,
  setErrors,
}: HashtagComponentProps) => {
  // could be refactored
  const [hashtag, setHashtag] = useState<string>(initialHashtagValue);
  const [isBlocked, setIsBlocked] = useState<boolean>(currentState.isBlocked);

  const submitHashtag = () => {
    const error = validateHashtag(hashtag);
    if (!error) {
      setIsBlocked(true);
      setHashtags(
        allHashtags.map((value) =>
          value.hashtag === initialHashtagValue
            ? { hashtag: hashtag, isBlocked: true }
            : value
        )
      );
      setErrors((prevState) => ({
        ...prevState,
        hashtagError: "",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        hashtagError: error,
      }));
    }
  };

  const startEditing = () => {
    setIsBlocked(false);
  };

  const removeHashtag = () => {
    if (isBlocked) {
      setHashtags(
        allHashtags.filter((ht) => ht.hashtag !== currentState.hashtag)
      );
    }
  };

  return (
    <div className="hashtag-wrapper">
      <input
        type="text"
        className="hashtag-input"
        onChange={(e) => setHashtag(e.target.value)}
        value={hashtag}
        disabled={isBlocked}
      ></input>

      <div className="icons-container">
        <i
          className="bi bi-check-lg icon"
          style={{ display: isBlocked ? "none" : "" }}
          onClick={submitHashtag}
        ></i>
        <i
          className="bi bi-pen icon"
          style={{ display: !isBlocked ? "none" : "" }}
          onClick={startEditing}
        ></i>
        <i
          className="bi bi-x icon"
          onClick={removeHashtag}
          style={{ display: !isBlocked ? "none" : "" }}
        ></i>{" "}
      </div>
    </div>
  );
};
