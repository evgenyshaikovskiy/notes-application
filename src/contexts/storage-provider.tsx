/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { Note } from "../types";

interface StorageContextType {
  notes: Note[];
  addNote: (content: string, hashtags: string[]) => void;
  removeNote: (id: number) => void;
  editNote: (newNote: Note, id: number) => void;
}

export const StorageContext = createContext<StorageContextType>({
  notes: [],
  addNote: () => {},
  removeNote: () => {},
  editNote: () => {},
});

type StorageContextProviderProps = {
  children: ReactNode;
};

export const StorageContextProvider = ({
  children,
}: StorageContextProviderProps) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    updateNotesFromStorage();
  }, []);

  const updateNotesFromStorage = () => {
    const unparsed = localStorage.getItem("notes");
    if (unparsed) {
      setNotes(JSON.parse(unparsed));
    }
  };

  const findFirstFreeId = () => {
    let currentId = 1;
    const takenIds = new Set(notes.map((note) => note.id));
    while (takenIds.has(currentId)) {
      currentId++;
    }

    return currentId;
  };

  const addNote = (content: string, hashtags: string[]) => {
    const newNote = {
      content: content,
      hashtags: hashtags,
      id: findFirstFreeId(),
    };
    localStorage.setItem("notes", JSON.stringify([...notes, newNote]));
    updateNotesFromStorage();
  };

  const removeNote = (id: number) => {
    localStorage.clear();
    localStorage.setItem("notes", JSON.stringify([...notes.filter((note) => note.id !== id)]));
    updateNotesFromStorage();
  };

  const editNote = (newNote: Note, id: number) => {
    setNotes([...notes]);
  };

  const value = {
    notes,
    addNote,
    removeNote,
    editNote,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};
