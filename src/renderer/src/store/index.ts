import { NoteContent, NoteInfo } from "@shared/models";
import { ThemeMode } from "@shared/types";
import { atom } from "jotai";
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

export const createEmptyNoteAtom = atom(
  null,
  async (get, set, filename?: string) => {
    const notes = get(notesAtom);

    if (!notes) return;

    if (!filename) {
      console.error("No filename provided for note creation");
      return;
    }

    const title = await window.context.createNote(filename);
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
  },
);

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

// Simpler implementation of theme atom that will properly update
export const themeAtom = atom<ThemeMode>("dark");

// Initialize the theme from settings when the app starts
export const initializeThemeFromSettings = async (
  setTheme: (theme: ThemeMode) => void,
) => {
  try {
    const settings = await window.context.getSettings();
    if (settings.theme === "light" || settings.theme === "dark") {
      setTheme(settings.theme);
    }
  } catch (error) {
    console.error("Error loading theme settings:", error);
  }
};

export const showChatAtom = atom(false);
export const showSettingsAtom = atom(false);
export const showLeftSideBarAtom = atom(true);

export const renameNoteAtom = atom(
  null,
  async (
    get,
    set,
    { oldTitle, newTitle }: { oldTitle: string; newTitle: string },
  ) => {
    const notes = get(notesAtom);
    const selectedNote = get(selectedNoteAtom);

    if (!notes) return false;

    // Validate new title
    if (!newTitle.trim()) return false;

    // For file system operations, ensure we have the .md extension
    const oldFileTitle = oldTitle.endsWith(".md") ? oldTitle : `${oldTitle}.md`;
    const newFileTitle = newTitle.endsWith(".md") ? newTitle : `${newTitle}.md`;

    // The display title doesn't have .md extension
    const displayTitle = newTitle.endsWith(".md")
      ? newTitle.slice(0, -3)
      : newTitle;

    // Check if name already exists
    if (
      notes.some((note) => {
        const noteTitle = note.title.endsWith(".md")
          ? note.title.slice(0, -3)
          : note.title;
        return noteTitle === displayTitle;
      })
    ) {
      console.error("A note with this name already exists");
      return false;
    }

    // Check for invalid characters in filename
    const hasInvalidChars = /[\\/:*?"<>|]/g.test(newTitle);
    if (hasInvalidChars) {
      console.error("Filename contains invalid characters");
      return false;
    }

    try {
      // Use the native rename function - this avoids the OS confirmation dialog
      const success = await window.context.renameNote(
        oldFileTitle,
        newFileTitle,
      );

      if (!success) {
        console.error("Failed to rename note");
        return false;
      }

      // Update the UI state after successful file system operation
      const updatedNotes = notes.map((note) => {
        if (note.title === oldTitle || note.title === oldFileTitle) {
          return { ...note, title: displayTitle, lastEditTime: Date.now() };
        }
        return note;
      });

      set(notesAtom, updatedNotes);

      // Update the selected note index if needed
      if (
        selectedNote &&
        (selectedNote.title === oldTitle || selectedNote.title === oldFileTitle)
      ) {
        const newSelectedIndex = updatedNotes.findIndex(
          (note) => note.title === displayTitle,
        );
        if (newSelectedIndex !== -1) {
          set(selectedNoteIndexAtom, newSelectedIndex);
        }
      }

      return true;
    } catch (error) {
      console.error("Failed to rename note:", error);
      return false;
    }
  },
);
