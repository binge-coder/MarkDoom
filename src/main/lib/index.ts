import { homedir } from "os";
import { appDirectoryName, fileEncoding } from "../../shared/constants";
import { ensureDir, readdir, stat } from "fs-extra";
import { NoteInfo } from "../../shared/models";
import { GetNotes } from "../../shared/types";

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
