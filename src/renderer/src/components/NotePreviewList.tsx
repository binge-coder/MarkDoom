// import { notesMock } from "@/store/mocks";
import { ComponentProps } from "react";
import { NotePreview } from "@/components";
import { twMerge } from "tailwind-merge";
import { useNotesList } from "@/hooks/useNotesList";

export const NotePreviewList = ({
  className,
  ...props
}: ComponentProps<"ul">) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({});
  if (notes.length === 0) {
    return (
      <ul className={twMerge("text-center mt-4", className)}>
        <span>No notes found!</span>
      </ul>
    );
  }
  return (
    <ul className={className} {...props}>
      {/* {notes.map((note) => (
        <li key={note.title}>{note.title}</li>
      ))} */}
      {notes.map((note, index) => (
        <NotePreview
          key={note.title}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          {...note}
        />
      ))}
    </ul>
  );
};
