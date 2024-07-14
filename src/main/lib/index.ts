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
import path from "path";

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
  const filePath = path.join(
    rootDir,
    filename.endsWith(".md") ? filename : `${filename}.md`,
  );

  console.info(`Reading note from: ${filePath}`);

  if (!existsSync(filePath)) {
    console.info(`File not found: ${filePath}. Creating a new file.`);
    await writeFile(filePath, "", { encoding: fileEncoding });
    return "";
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
  await writeFile(filePath, content, { encoding: fileEncoding });
};
