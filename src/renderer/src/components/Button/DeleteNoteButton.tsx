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
    <ActionButton onClick={handleDeletion} title={"Delete Note"} {...props}>
      <FaRegTrashCan className="h-5 w-5" />
    </ActionButton>
  );
};
