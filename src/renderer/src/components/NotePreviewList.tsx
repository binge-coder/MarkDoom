// import { notesMock } from "@/store/mocks";
import { ComponentProps } from "react";
import { NotePreview } from "@/components";
import { twMerge } from "tailwind-merge";
import { useNotesList } from "@/hooks/useNotesList";
import { isEmpty } from "lodash";

export type NotePreviewListProps = ComponentProps<"ul"> & {
  onSelect?: () => void;
};

export const NotePreviewList = ({
  onSelect,
  className,
  ...props
}: NotePreviewListProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({
    onSelect,
  });

  if (!notes) return null;

  if (isEmpty(notes)) {
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
