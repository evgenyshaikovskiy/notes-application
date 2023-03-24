import React, { useState } from "react";

import "./hashtag.styles.css";
import { validateHashtag } from "../../utils";
import { NoteFormErrors } from "../../types";

type HashtagComponentProps = {
  initialHashtag: string;
  allHashtags: string;
  isActiveDefault: boolean;
  setHashtags: (value: string) => void;
  setEditIsFinished: (value: boolean) => void;
  setErrors: React.Dispatch<React.SetStateAction<NoteFormErrors>>;
};

export const HashtagComponent = ({
  initialHashtag,
  allHashtags,
  isActiveDefault,
  setEditIsFinished,
  setHashtags,
  setErrors,
}: HashtagComponentProps) => {
  const [hashtag, setHashtag] = useState<string>(initialHashtag);
  const [isBlocked, setIsBlocked] = useState<boolean>(isActiveDefault);

  const submitHashtag = () => {
    const error = validateHashtag(hashtag);
    console.log(error);
    if (!error) {
      setIsBlocked(true);
      setEditIsFinished(true);
      setHashtags(
        allHashtags
          .split(" ")
          .map((value) => (value === initialHashtag ? hashtag.trim() : value))
          .join(" ")
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
    setEditIsFinished(false);
  };

  const removeHashtag = () => {
    if (isBlocked) {
      setHashtags(
        allHashtags
          .split(" ")
          .filter((ht) => ht.trim() !== hashtag.trim())
          .join(" ")
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
