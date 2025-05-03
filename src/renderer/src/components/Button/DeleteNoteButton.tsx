import { ActionButton, ActionButtonProps } from "@/components";
import { deleteNoteAtom } from "@/store";
import { useSetAtom } from "jotai";
import { Trash2 } from "lucide-react";

export const DeleteNoteButton = (...props: ActionButtonProps[]) => {
  const deleteNote = useSetAtom(deleteNoteAtom);
  const handleDeletion = async () => {
    //log
    console.log("handleDeletion function");
    await deleteNote();
  };
  return (
    <ActionButton onClick={handleDeletion} title={"Delete Note"} {...props}>
      <Trash2 className="h-5 w-5" />
    </ActionButton>
  );
};
