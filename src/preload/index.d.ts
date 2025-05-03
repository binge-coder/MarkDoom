import {
  CreateNote,
  DeleteNote,
  GetNotes,
  GetSettings,
  ReadNote,
  SaveSettings,
  WriteNote,
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
      applyBackgroundMaterial: (material: string) => Promise<{
        success: boolean;
        error?: string;
        appliedMaterial?: string;
        currentSettings?: {
          backgroundColor?: string;
        };
      }>;
      toggleFullscreen: () => Promise<{
        success: boolean;
        isFullScreen?: boolean;
        error?: string;
      }>;
    };
  }
}
