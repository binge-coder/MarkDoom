import { ConfirmDialog } from "@renderer/components/Dialog";
import {
  deleteNoteAtom,
  renameNoteAtom,
  selectedNoteIndexAtom,
} from "@renderer/store";
import { cn, formatDateFromMS } from "@renderer/utils";
import { NoteInfo } from "@shared/models";
import { motion, MotionProps } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { Calendar, FileText, Pencil, Trash2 } from "lucide-react";
import { ComponentProps, useState } from "react";

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean;
} & ComponentProps<"div">;

export const NotePreview = ({
  title,
  content,
  lastEditTime,
  className,
  isActive = false,
  ...props
}: NotePreviewProps) => {
  const date = formatDateFromMS(lastEditTime);
  // Remove .md extension for display purposes
  const displayTitle = title.endsWith(".md") ? title.slice(0, -3) : title;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(displayTitle);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const renameNote = useSetAtom(renameNoteAtom);
  const deleteNote = useSetAtom(deleteNoteAtom);
  const [, setSelectedNoteIndex] = useAtom(selectedNoteIndexAtom);

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent note selection
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent note selection
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // First select this note so the atom deletes the correct one
    if (!isActive) {
      // Find index of this note in the list
      const index =
        props.onClick && "__index" in props.onClick
          ? (props.onClick as { __index: number }).__index
          : -1;
      if (index !== -1) {
        setSelectedNoteIndex(index);
      }
    }

    // Then delete it
    await deleteNote();
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent note selection

    if (newTitle.trim() && newTitle !== displayTitle) {
      const success = await renameNote({
        oldTitle: title,
        newTitle: newTitle.trim(),
      });
      if (!success) {
        // Reset to original title if rename failed
        setNewTitle(displayTitle);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setNewTitle(displayTitle);
      setIsEditing(false);
      e.stopPropagation();
    }
  };

  const handleBlur = () => {
    setNewTitle(displayTitle);
    setIsEditing(false);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          "cursor-pointer px-3 py-3 rounded-md transition-all duration-150",
          isActive
            ? "bg-slate-900/80 border-l-4 border-blue-500 shadow-md"
            : "bg-slate-800/60 hover:bg-slate-700/60 border-l-4 border-transparent",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...(props as React.HTMLAttributes<HTMLDivElement> & MotionProps)}
      >
        <div className="flex items-start mb-2">
          <FileText
            size={18}
            className={cn(
              "mt-0.5 mr-2 flex-shrink-0",
              isActive ? "text-blue-400" : "text-slate-300",
            )}
          />

          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-slate-700/90 text-white px-2 py-1.5 rounded outline-none border border-blue-500/60 focus:ring-1 focus:ring-blue-500/50"
                onClick={(e) => e.stopPropagation()}
              />
            </form>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h3
                className={cn(
                  "text-base font-medium",
                  isActive ? "text-white" : "text-slate-200",
                )}
              >
                {displayTitle}
              </h3>

              {isHovered && (
                <div className="flex items-center gap-1.5">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleRenameClick}
                    className="text-slate-400 hover:text-white bg-slate-700/60 hover:bg-slate-600/60 p-1 rounded transition-colors"
                    aria-label="Rename note"
                    title="Rename note"
                  >
                    <Pencil size={14} />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleDeleteClick}
                    className="text-slate-400 hover:text-red-400 bg-slate-700/60 hover:bg-red-500/20 p-1 rounded transition-colors"
                    aria-label="Delete note"
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center ml-6 text-xs font-light">
          <Calendar size={14} className="mr-1.5 text-slate-300" />
          <span className={cn(isActive ? "text-slate-200" : "text-slate-400")}>
            {date}
          </span>
        </div>
      </motion.div>

      {/* Custom styled confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Note"
        message={`Are you sure you want to delete "${displayTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};
