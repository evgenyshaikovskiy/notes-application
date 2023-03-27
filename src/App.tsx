import React, { useContext, useState } from "react";
import { StorageContext } from "./contexts/storage.context";
import { NoteComponent } from "./components/note/note.component";
import { ModalWindow } from "./components/modal/modal.component";
import { NoteForm } from "./components/note-form/note-form";
import "./App.css";
import { FilterComponent } from "./components/filter/filter.component";

function App() {
  const { notes } = useContext(StorageContext);
  const [visible, setVisible] = useState(false);

  return (
    <div className="App">
      <div className="note-actions-container">
        <FilterComponent></FilterComponent>
        <button
          type="button"
          className="note-create-btn btn"
          onClick={() => setVisible(true)}
        >
          Create note
        </button>
      </div>
      {notes.length > 0 ? (
        <div className="notes-container">
          {notes.map((note) => {
            return <NoteComponent note={note} key={note.id}></NoteComponent>;
          })}
        </div>
      ) : (
        <div className="no-notes-text-msg">
          No notes was found.
          <div className="no-notes-advice-msg">
            Remove filters or add new note.
          </div>
        </div>
      )}

      <ModalWindow visible={visible} setVisible={setVisible}>
        <NoteForm onSubmitCallback={() => setVisible(false)}></NoteForm>
      </ModalWindow>
    </div>
  );
}

export default App;
