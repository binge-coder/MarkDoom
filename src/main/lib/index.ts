import {
  ensureDir,
  existsSync,
  readdir,
  readFile,
  remove,
  rename,
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
  RenameNote,
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

export const createNote: CreateNote = async (filename) => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  // If no filename is provided, return false (invalid operation)
  if (!filename) {
    console.log("Note creation canceled: No filename provided");
    return false;
  }

  // Ensure filename has .md extension
  const noteFilename = filename.endsWith(".md") ? filename : `${filename}.md`;
  const filePath = path.join(rootDir, noteFilename);

  // Check if file already exists
  if (existsSync(filePath)) {
    console.error(`Cannot create note: File already exists: ${filePath}`);
    return false;
  }

  try {
    console.info(`Creating note: ${filePath}`);
    await writeFile(filePath, "");

    // Return the filename without extension for consistency with UI
    return noteFilename;
  } catch (error) {
    console.error(`Failed to create note: ${error}`);
    return false;
  }
};

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir();

  // I have implemented a custom delete confirmation dialog instead of using this below code. this is kept for reference.
  // const { response } = await dialog.showMessageBox({
  //   type: "warning",
  //   title: "Delete note",
  //   message: `Are you sure you want to delete ${filename}?`,
  //   buttons: ["Delete", "Cancel"], // 0 is Delete, 1 is Cancel
  //   defaultId: 1,
  //   cancelId: 1,
  // });

  // if (response === 1) {
  //   console.info("Note deletion canceled");
  //   return false;
  // }

  const filePath = path.join(
    rootDir,
    filename.endsWith(".md") ? filename : `${filename}.md`,
  );

  console.info(`Deleting note: ${filename}`);
  // await remove(`${rootDir}/${filename}.md`);
  await remove(filePath);
  return true;
};

export const renameNote: RenameNote = async (oldFilename, newFilename) => {
  const rootDir = getRootDir();

  const oldFilePath = path.join(
    rootDir,
    oldFilename.endsWith(".md") ? oldFilename : `${oldFilename}.md`,
  );

  const newFilePath = path.join(
    rootDir,
    newFilename.endsWith(".md") ? newFilename : `${newFilename}.md`,
  );

  // Check if source exists
  if (!existsSync(oldFilePath)) {
    console.error(`Source file does not exist: ${oldFilePath}`);
    return false;
  }

  // Check if destination already exists
  if (existsSync(newFilePath)) {
    console.error(`Destination file already exists: ${newFilePath}`);
    return false;
  }

  try {
    console.info(`Renaming note from ${oldFilePath} to ${newFilePath}`);
    await rename(oldFilePath, newFilePath);
    return true;
  } catch (error) {
    console.error(`Failed to rename note: ${error}`);
    return false;
  }
};

const defaultSettings = {
  language: "en",
  geminiApi: "",
  backgroundMaterial: "acrylic", // Ensure this matches the allowed values
  zenModeShortcut: "F11", // Use the new property name consistently
  theme: "dark", // Default theme is dark mode
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
