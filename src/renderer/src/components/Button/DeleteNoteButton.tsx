import { ActionButton, ActionButtonProps } from "@/components";
import { deleteNoteAtom } from "@/store";
import { useSetAtom } from "jotai";
import { FaRegTrashCan } from "react-icons/fa6";

export const DeleteNoteButton = (...props: ActionButtonProps[]) => {
  const deleteNote = useSetAtom(deleteNoteAtom);
  const handleDeletion = async () => {
    //log
    console.log("handleDeletion function");
    await deleteNote();
  };
  return (
    <ActionButton onClick={handleDeletion} {...props}>
      <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  );
};
