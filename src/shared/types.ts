import { NoteContent, NoteInfo } from "./models";

export type ThemeMode = "light" | "dark";

export type GetNotes = () => Promise<NoteInfo[]>;
export type ReadNote = (title: NoteInfo["title"]) => Promise<NoteContent>;
export type WriteNote = (
  title: NoteInfo["title"],
  content: NoteContent,
) => Promise<void>;
export type CreateNote = (
  filename: string,
) => Promise<NoteInfo["title"] | false>;
export type DeleteNote = (title: NoteInfo["title"]) => Promise<boolean>;
export type RenameNote = (
  oldTitle: NoteInfo["title"],
  newTitle: NoteInfo["title"],
) => Promise<boolean>;

export type Settings = {
  language: string;
  geminiApi: string;
  backgroundMaterial: string;
  zenModeShortcut: string;
  theme: ThemeMode;
};

export type GetSettings = () => Promise<Settings>;
export type SaveSettings = (
  newSettings: Settings,
) => Promise<{ success: boolean }>;
