/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { Note, StorageContextType } from "../types";

export const StorageContext = createContext<StorageContextType>({
  notes: [],
  addNote: () => {},
  removeNote: () => {},
  editNote: () => {},
  setFilters: () => {},
});

type StorageContextProviderProps = {
  children: ReactNode;
};

export const StorageContextProvider = ({
  children,
}: StorageContextProviderProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  const baseUrlServer =
    "https://json-server-notes-application.herokuapp.com/notes";

  useEffect(() => {
    updateNotesFromStorage();
  }, []);

  useEffect(() => {
    console.log("filtering");
    console.log(filters);
    if (filters.length > 0 && filters.at(0) !== "") {
      const filtered = notes.filter((note) => {
        const noteHashtags = note.hashtags.join(" ").toLocaleLowerCase();
        return filters
          .map((filter) => noteHashtags.indexOf(filter.toLocaleLowerCase()))
          .every((idx) => idx < 0)
          ? false
          : true;
      });

      setNotes([...filtered]);
    } else {
      updateNotesFromStorage();
    }
  }, [filters]);

  const updateNotesFromStorage = async () => {
    const response = await fetch(baseUrlServer, { method: "GET" });

    if (response.ok) {
      const data = await response.json();

      // filtering process
      setNotes(data as Note[]);
    }
  };

  const addNote = async (content: string, hashtags: string[]) => {
    const newNote = {
      content: content,
      hashtags: hashtags,
    };
    console.log(newNote);

    const response = await fetch(baseUrlServer, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(newNote),
    });

    const result = await response.json();

    if (result) {
      console.log(`${result} was created successfully`);
    }
    updateNotesFromStorage();
  };

  const removeNote = async (id: number) => {
    const response = await fetch(baseUrlServer + `/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(`Item with id ${id} was deleted.`);
      updateNotesFromStorage();
    }
  };

  const editNote = async (newNote: Note) => {
    const body = { hashtags: newNote.hashtags, content: newNote.content };
    const response = await fetch(baseUrlServer + `/${newNote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      console.log(`${newNote} was successfully updated.`);
      updateNotesFromStorage();
    }
  };

  const value = {
    notes,
    addNote,
    removeNote,
    editNote,
    setFilters,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};
