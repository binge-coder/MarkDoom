import { ActionButton, ActionButtonProps } from "@/components";
import { createEmptyNoteAtom } from "@/store";
import { useSetAtom } from "jotai";
import { LuFileSignature } from "react-icons/lu";
// import ActionButton from "@/components/Button/ActionButton";

export const NewNoteButton = (...props: ActionButtonProps[]) => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom);
  const handleCreation = async () => {
    await createEmptyNote();
  };
  return (
    <ActionButton onClick={handleCreation} {...props}>
      <LuFileSignature className="h-5 w-5" />
    </ActionButton>
  );
};
