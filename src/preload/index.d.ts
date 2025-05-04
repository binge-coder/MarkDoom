import {
  CreateNote,
  DeleteNote,
  GetNotes,
  GetSettings,
  ReadNote,
  RenameNote,
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
      renameNote: RenameNote;
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
      // Zen Mode terminology
      toggleZenMode: () => Promise<{
        success: boolean;
        isZenMode?: boolean;
        error?: string;
      }>;
      updateZenModeShortcut: (shortcut: string) => Promise<{
        success: boolean;
      }>;
    };
  }
}
