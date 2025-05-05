import { ActionButton, ActionButtonProps } from "@/components";
import { CreateNoteDialog } from "@/components/Dialog";
import { createEmptyNoteAtom, themeAtom } from "@/store";
import { cn } from "@renderer/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { FilePlus } from "lucide-react";
import { useState } from "react";

export const NewNoteButton = (props: ActionButtonProps) => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCreateNote = async (noteName: string) => {
    await createEmptyNote(noteName);
    setIsDialogOpen(false);
  };

  return (
    <>
      <ActionButton onClick={handleOpenDialog} title="New Note" {...props}>
        <FilePlus
          className={cn(
            "h-5 w-5",
            isLightMode ? "text-slate-600" : "text-slate-300",
          )}
        />
      </ActionButton>

      <CreateNoteDialog
        isOpen={isDialogOpen}
        onConfirm={handleCreateNote}
        onCancel={handleCloseDialog}
        placeholder="Enter note name..."
      />
    </>
  );
};
