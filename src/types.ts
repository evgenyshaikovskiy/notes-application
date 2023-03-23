export interface Note {
  id: number;
  content: string;
  hashtags: string[];
}

export interface NoteFormErrors {
  hashtagError: string;
  contentError: string;
}

export interface StorageContextType {
  notes: Note[];
  addNote: (content: string, hashtags: string[]) => void;
  removeNote: (id: number) => void;
  editNote: (newNote: Note) => void;
}

export interface NoteFormContextType {
  hashtags: string;
  content: string;
  formErrors: NoteFormErrors;

  setHashtags: (hashtags: string) => void;
  setContent: (content: string) => void;

  onFormSubmit: (submitCallback: () => void, note?: Note) => void;
}
