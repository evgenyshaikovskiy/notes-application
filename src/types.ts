export interface Note {
  id: number;
  content: string;
  hashtags: string[];
}

export interface HashtagState {
  isBlocked: boolean;
  hashtag: string;
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
  setFilters: (filters: string[]) => void;
}
