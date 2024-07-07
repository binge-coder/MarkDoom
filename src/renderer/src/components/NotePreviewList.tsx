import { notesMock } from "@/store/mocks";
import { ComponentProps } from "react";
import { NotePreview } from "./NotePreview";
import { twMerge } from "tailwind-merge";

export const NotePreviewList = ({
  className,
  ...props
}: ComponentProps<"ul">) => {
  if (notesMock.length === 0) {
    return (
      <ul className={twMerge("text-center mt-4", className)}>
        <span>No notes found!</span>
      </ul>
    );
  }
  return (
    <ul className={className} {...props}>
      {/* {notesMock.map((note) => (
        <li key={note.title}>{note.title}</li>
      ))} */}
      {notesMock.map((note) => (
        <NotePreview key={note.title} {...note} />
      ))}
    </ul>
  );
};
