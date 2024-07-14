import { homedir } from "os";
import { appDirectoryName, fileEncoding } from "../../shared/constants";
import {
  ensureDir,
  existsSync,
  readdir,
  readFile,
  stat,
  writeFile,
} from "fs-extra";
import { NoteInfo } from "../../shared/models";
import { GetNotes, ReadNote, WriteNote } from "../../shared/types";

export const getRootDir = () => {
  return `${homedir}/${appDirectoryName}`;
};

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false,
  });

  const notes = notesFileNames.filter((fileName) => fileName.endsWith(".md"));

  //   if (isEmpty(notes)) {
  //     console.info("No notes found, creating a welcome note");

  //     const content = await readFile(welcomeNoteFile, { encoding: fileEncoding });

  //     // create the welcome note
  //     await writeFile(`${rootDir}/${welcomeNoteFilename}`, content, {
  //       encoding: fileEncoding,
  //     });

  //     notes.push(welcomeNoteFilename);
  //   }

  return Promise.all(notes.map(getNoteInfoFromFilename));
};

export const getNoteInfoFromFilename = async (
  filename: string,
): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`);

  return {
    title: filename.replace(/\.md$/, ""),
    lastEditTime: fileStats.mtimeMs,
  };
};

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir();
  const filePath = `${rootDir}/${filename}.md`;

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
  console.info(`Writing note: ${filename}`);
  await writeFile(`${rootDir}/${filename}`, content, {
    encoding: fileEncoding,
  });
};
