import { ActionButton, ActionButtonProps } from "@/components";
import { createEmptyNoteAtom } from "@/store";
import { useSetAtom } from "jotai";
import { LuFilePlus } from "react-icons/lu"; // Changed to LuFilePlus which is definitely available

export const NewNoteButton = (...props: ActionButtonProps[]) => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom);
  const handleCreation = async () => {
    await createEmptyNote();
  };
  return (
    <ActionButton onClick={handleCreation} title={"New Note"} {...props}>
      <LuFilePlus className="h-5 w-5" />
    </ActionButton>
  );
};
