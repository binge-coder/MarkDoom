import { NoteContent, NoteInfo } from "./models";

export type GetNotes = () => Promise<NoteInfo[]>;
export type ReadNote = (title: NoteInfo["title"]) => Promise<NoteContent>;
export type WriteNote = (
  title: NoteInfo["title"],
  content: NoteContent,
) => Promise<void>;
export type CreateNote = () => Promise<NoteInfo["title"] | false>;
export type DeleteNote = (title: NoteInfo["title"]) => Promise<boolean>;

export type Settings = {
  language: string;
  geminiApi: string;
  backgroundMaterial: string;
  zenModeShortcut: string;
};

export type GetSettings = () => Promise<Settings>;
export type SaveSettings = (
  newSettings: Settings,
) => Promise<{ success: boolean }>;
