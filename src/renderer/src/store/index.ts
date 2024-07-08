import { atom } from "jotai";
import { NoteInfo } from "@shared/models";
import { notesMock } from "@/store/mocks";

export const notesAtom = atom<NoteInfo[]>(notesMock);

export const selectedNoteIndexAtom = atom<number | null>(null);

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom);
  const selectedNoteIndex = get(selectedNoteIndexAtom);
  if (!selectedNoteIndex) return null;
  const selectedNote = notes[selectedNoteIndex];
  return {
    ...selectedNote,
    content: `#hello from note number ${selectedNoteIndex}`,
  };
});
