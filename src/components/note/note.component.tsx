import React, { useContext } from "react";
import { Note } from "../../types";
import { StorageContext } from "../../contexts/storage-provider";

export const NoteComponent = ({ note }: { note: Note }) => {
  const { removeNote, editNote } = useContext(StorageContext);

  return (
    <div className="note-content-wrapper">
      <div className="note-hashtags-list">{note.hashtags.join(" ")}</div>
      <div className="note-content">{note.content}</div>
      <div className="note-action-btns">
        <button className="edit-note-btn">Edit</button>
        <button className="remove-note-btn" onClick={() => removeNote(note.id)}>
          Remove
        </button>
      </div>
    </div>
  );
};
