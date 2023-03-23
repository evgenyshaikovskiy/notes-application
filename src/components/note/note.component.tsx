import React, { useContext, useState } from "react";
import { Note } from "../../types";
import { StorageContext } from "../../contexts/storage.context";
import { ModalWindow } from "../modal/modal.component";
import { NoteForm } from "../note-form/note-form";

import './note.styles.css'

export const NoteComponent = ({ note }: { note: Note }) => {
  const { removeNote } = useContext(StorageContext);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="note-content-wrapper">
        <div className="note-hashtags-list">{note.hashtags.join(" ")}</div>
        <div className="note-content">{note.content}</div>
        <div className="note-action-icons">
          <i
            className="bi bi-pen action-icon"
            onClick={() => setVisible(true)}
          ></i>
          <i className="bi bi-trash action-icon" onClick={() => removeNote(note.id)}></i>
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
