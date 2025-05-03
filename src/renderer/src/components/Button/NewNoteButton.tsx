import { ActionButton, ActionButtonProps } from "@/components";
import { createEmptyNoteAtom } from "@/store";
import { useSetAtom } from "jotai";
import { FilePlus } from "lucide-react";

export const NewNoteButton = (...props: ActionButtonProps[]) => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom);
  const handleCreation = async () => {
    await createEmptyNote();
  };
  return (
    <ActionButton onClick={handleCreation} title={"New Note"} {...props}>
      <FilePlus className="h-5 w-5" />
    </ActionButton>
  );
};
