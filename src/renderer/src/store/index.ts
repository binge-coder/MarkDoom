import { atom } from "jotai";
import { NoteContent, NoteInfo } from "@shared/models";
import { notesMock } from "@/store/mocks";
import { unwrap } from "jotai/utils";

const loadNotes = async () => {
  const notes = await window.context.getNotes();

  //sort by most recently edited
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime);

  //change to sort by most recently created? better for journalling
};

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes());

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev);

export const selectedNoteIndexAtom = atom<number | null>(null);

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom);
  const selectedNoteIndex = get(selectedNoteIndexAtom);
  if (selectedNoteIndex == null || !notes) return null;
  const selectedNote = notes[selectedNoteIndex];

  const noteContent = await window.context.readNote(selectedNote.title);

  return {
    ...selectedNote,
    content: noteContent,
  };
});

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: "",
      content: "",
      lastEditTime: "",
    },
);

export const saveNoteAtom = atom(
  null,
  async (get, set, newContent: NoteContent) => {
    const notes = get(notesAtom);
    const selectedNote = get(selectedNoteAtom);
    if (!selectedNote || !notes) return;

    //saving to disk
    await window.context.writeNote(selectedNote.title, newContent);
    //update the saved note's last edit time
    set(
      notesAtom,
      notes.map((note) => {
        if (note.title === selectedNote.title) {
          return {
            ...note,
            lastEditTime: Date.now(),
          };
        }
        return note;
      }),
    );
  },
);

export const createEmptyNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom);

  if (!notes) return;

  const title = await window.context.createNote();
  if (!title) return;

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now(),
  };

  set(notesAtom, [
    newNote,
    ...notes.filter((note) => note.title !== newNote.title),
  ]);

  set(selectedNoteIndexAtom, 0);
});

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom);
  const selectedNote = get(selectedNoteAtom);

  if (!selectedNote || !notes) return;

  const isDeleted = await window.context.deleteNote(selectedNote.title);

  if (!isDeleted) return;

  // filter out the deleted notes
  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title),
  );

  // make selected note null
  set(selectedNoteIndexAtom, null);
});

export const showChatAtom = atom(false);
export const showSettingsAtom = atom(false);
