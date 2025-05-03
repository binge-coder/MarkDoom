import { dialog } from "electron";
import {
  ensureDir,
  existsSync,
  readdir,
  readFile,
  remove,
  stat,
  writeFile,
} from "fs-extra";
import { isEmpty } from "lodash";
import { homedir } from "os";
import path from "path";
import welcomeNoteFile from "../../../resources/welcomeNote.md?asset";
import {
  appDirectoryName,
  fileEncoding,
  welcomeNoteFileName,
} from "../../shared/constants";
import { NoteInfo } from "../../shared/models";
import {
  CreateNote,
  DeleteNote,
  GetNotes,
  ReadNote,
  WriteNote,
} from "../../shared/types";

export const getRootDir = () => {
  return path.join(homedir(), appDirectoryName);
};

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false,
  });

  const notes = notesFileNames.filter((fileName) => fileName.endsWith(".md"));

  if (isEmpty(notes)) {
    console.log("no notes found, creating a welcome note");
    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding });
    // const filePath = path.join(rootDir,)
    await writeFile(`${rootDir}/${welcomeNoteFileName}`, content, {
      encoding: fileEncoding,
    });
    notes.push(welcomeNoteFileName);
  }

  return Promise.all(notes.map(getNoteInfoFromFilename));
};

export const getNoteInfoFromFilename = async (
  filename: string,
): Promise<NoteInfo> => {
  const filePath = path.join(getRootDir(), filename);
  const fileStats = await stat(filePath);

  return {
    title: filename.replace(/\.md$/, ""),
    lastEditTime: fileStats.mtimeMs,
  };
};

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir();
  const filePath = path.join(
    rootDir,
    filename.endsWith(".md") ? filename : `${filename}.md`,
  );

  // Log the file path
  console.info(`Reading note from: ${filePath}`);

  // Check if the file exists
  if (!existsSync(filePath)) {
    const error = new Error(`File not found: ${filePath}`);
    console.error(error);
    throw error;
  }

  return readFile(filePath, { encoding: fileEncoding });
};

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir();
  const filePath = path.join(
    rootDir,
    filename.endsWith(".md") ? filename : `${filename}.md`,
  );

  console.info(`Writing note: ${filePath}`);
  await writeFile(filePath, content, {
    encoding: fileEncoding,
  });
};

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "New Note",
    defaultPath: path.join(rootDir, "Untitled.md"),
    buttonLabel: "Create",
    properties: ["showOverwriteConfirmation"],
    showsTagField: false,
    filters: [{ name: "Markdown", extensions: ["md"] }],
  });
  if (canceled || !filePath) {
    console.log("Note creation canceled");
    return false;
  }
  const { name: filename, dir: parentDir } = path.parse(filePath);

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: "error",
      title: "Creation failed",
      message: `All notes must be saved under ${rootDir}. Avoid using other directories!`,
    });

    return false;
  }
  console.info(`Creating note: ${filePath}`);
  await writeFile(filePath, "");

  return filename;
};

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir();

  const { response } = await dialog.showMessageBox({
    type: "warning",
    title: "Delete note",
    message: `Are you sure you want to delete ${filename}?`,
    buttons: ["Delete", "Cancel"], // 0 is Delete, 1 is Cancel
    defaultId: 1,
    cancelId: 1,
  });

  if (response === 1) {
    console.info("Note deletion canceled");
    return false;
  }

  const filePath = path.join(
    rootDir,
    filename.endsWith(".md") ? filename : `${filename}.md`,
  );

  console.info(`Deleting note: ${filename}`);
  // await remove(`${rootDir}/${filename}.md`);
  await remove(filePath);
  return true;
};

const defaultSettings = {
  language: "en",
  geminiApi: "",
  backgroundMaterial: "acrylic", // Ensure this matches the allowed values
  zenModeShortcut: "F11", // Renamed from fullscreenShortcut to zenModeShortcut
};

export const settingsPath = path.join(getRootDir(), "settings.json");

export const checkAndCreateSettingsFile = async () => {
  // Ensure the root directory exists
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  // Check if the file exists
  if (!existsSync(settingsPath)) {
    await writeFile(
      settingsPath,
      JSON.stringify(defaultSettings, null, 2),
      "utf-8",
    );
    console.log("settings.json created with default settings.");
  } else {
    console.log("settings.json already exists.");
  }
};
