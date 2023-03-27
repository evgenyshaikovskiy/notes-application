import React, { useContext, useState } from "react";
import { Note } from "../../types";
import { StorageContext } from "../../contexts/storage.context";
import { ModalWindow } from "../modal/modal.component";
import { NoteForm } from "../note-form/note-form";

import { ReactComponent as PenIcon } from "./../../assets/pen-icon.svg";
import { ReactComponent as TrashIcon } from "./../../assets/trash-icon.svg";

import "./note.styles.css";

export const NoteComponent = ({ note }: { note: Note }) => {
  const { removeNote } = useContext(StorageContext);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="note-component-wrapper">
        <div className="note-hashtags-list-wrapper">
          <div className="note-hashtags-list-title">Hashtags:</div>
          <div className="note-hashtags-list">{note.hashtags.join(" ")}</div>
        </div>
        <div className="note-content-wrapper">
          <div className="note-content-title">Message: </div>
          <div className="note-content">
            {note.content.split(" ").map((value, idx) =>
              value.startsWith("#") ? (
                <span className="highlight" key={idx}>
                  {value}{" "}
                </span>
              ) : (
                value + " "
              )
            )}
          </div>
        </div>
        <div className="note-action-icons">
          <PenIcon
            className="icon note-icon"
            onClick={() => setVisible(true)}
          ></PenIcon>
          <TrashIcon
            className="icon note-icon"
            onClick={() => removeNote(note.id)}
          ></TrashIcon>
        </div>
      </div>
      <ModalWindow visible={visible} setVisible={setVisible}>
        <NoteForm
          note={note}
          onSubmitCallback={() => setVisible(false)}
        ></NoteForm>
      </ModalWindow>
    </>
  );
};
