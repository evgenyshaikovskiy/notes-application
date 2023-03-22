import React, { useContext, useState } from "react";
import { Note } from "../../types";
import { StorageContext } from "../../contexts/storage-provider";
import { ModalWindow } from "../modal/modal.component";
import { NoteForm } from "../note-form/note-form";

export const NoteComponent = ({ note }: { note: Note }) => {
  const { removeNote } = useContext(StorageContext);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="note-content-wrapper">
        <div className="note-hashtags-list">{note.hashtags.join(" ")}</div>
        <div className="note-content">{note.content}</div>
        <div className="note-action-btns">
          <button className="edit-note-btn" onClick={() => setVisible(true)}>
            Edit
          </button>
          <button
            className="remove-note-btn"
            onClick={() => removeNote(note.id)}
          >
            Remove
          </button>
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
