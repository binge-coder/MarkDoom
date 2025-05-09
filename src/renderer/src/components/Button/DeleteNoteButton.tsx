// Not using this button anymore. I have a different button for deleting notes in the NotePreview component. I have implemented a custom delete confirmation dialog instead of using this below code. this is kept for reference.

import { ActionButton, ActionButtonProps } from "@/components";
import { deleteNoteAtom, themeAtom } from "@/store";
import { useAtomValue, useSetAtom } from "jotai";
import { Trash2 } from "lucide-react";

export const DeleteNoteButton = (...props: ActionButtonProps[]) => {
  const deleteNote = useSetAtom(deleteNoteAtom);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  const handleDeletion = async () => {
    //log
    console.log("handleDeletion function");
    await deleteNote();
  };

  return (
    <ActionButton onClick={handleDeletion} title={"Delete Note"} {...props}>
      <Trash2
        className={`h-5 w-5 ${isLightMode ? "text-slate-700" : "text-white/70"}`}
      />
    </ActionButton>
  );
};
