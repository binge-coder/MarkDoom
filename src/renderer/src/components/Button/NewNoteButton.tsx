import { ActionButton, ActionButtonProps } from "@/components";
import { CreateNoteDialog } from "@/components/Dialog";
import { createEmptyNoteAtom } from "@/store";
import { useSetAtom } from "jotai";
import { FilePlus } from "lucide-react";
import { useState } from "react";

export const NewNoteButton = (props: ActionButtonProps) => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        <FilePlus className="h-5 w-5" />
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
