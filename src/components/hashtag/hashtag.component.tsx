import React, { useState } from "react";

import { validateHashtag } from "../../utils";
import { HashtagState, NoteFormErrors } from "../../types";

import { ReactComponent as CheckIcon } from "./../../assets/check-icon.svg";
import { ReactComponent as PenIcon } from "./../../assets/pen-icon.svg";
import { ReactComponent as CircleIcon } from "./../../assets/circle-icon.svg";


import "./hashtag.styles.css";

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
        spellCheck={false}
        type="text"
        className="hashtag-input"
        onChange={(e) => setHashtag(e.target.value)}
        value={hashtag}
        disabled={isBlocked}
      ></input>

      <div className="icons-container">
        <CheckIcon
          className="icon hashtag-icon"
          style={{ display: isBlocked ? "none" : "" }}
          onClick={submitHashtag}
        ></CheckIcon>
        <PenIcon
          className="icon hashtag-icon"
          style={{ display: !isBlocked ? "none" : "" }}
          onClick={startEditing}
        ></PenIcon>
        <CircleIcon
          className="icon hashtag-icon"
          onClick={removeHashtag}
          style={{ display: !isBlocked ? "none" : "" }}
        ></CircleIcon>{" "}
      </div>
    </div>
  );
};
