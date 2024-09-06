import {
  CreateNote,
  DeleteNote,
  GetNotes,
  GetSettings,
  ReadNote,
  WriteNote,
  SaveSettings,
} from "@shared/types";

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      locale: string;
      getNotes: GetNotes;
      readNote: ReadNote;
      writeNote: WriteNote;
      createNote: CreateNote;
      deleteNote: DeleteNote;
      getSettings: GetSettings;
      saveSettings: SaveSettings;
    };
  }
}
