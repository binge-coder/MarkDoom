import { LeftBarHideButton, RightBarHideButton } from "@/components";
import { renameNoteAtom, selectedNoteAtom } from "@renderer/store";
import { useAtomValue, useSetAtom } from "jotai";
import { Pencil } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const FloatingNoteTitle = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const renameNote = useSetAtom(renameNoteAtom);
  const [isEditing, setIsEditing] = useState(false);
  // Remove .md extension for display
  const displayTitle = selectedNote?.title.endsWith(".md")
    ? selectedNote?.title.slice(0, -3)
    : selectedNote?.title;
  const [newTitle, setNewTitle] = useState(displayTitle || "");
  const [isHovered, setIsHovered] = useState(false);

  // Update newTitle when selected note changes
  useEffect(() => {
    setNewTitle(displayTitle || "");
  }, [displayTitle]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedNote) {
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedNote && newTitle.trim() && newTitle !== displayTitle) {
      const success = await renameNote({
        oldTitle: selectedNote.title,
        newTitle: newTitle.trim(),
      });

      if (!success) {
        // Reset to original title if rename failed
        setNewTitle(displayTitle || "");
      }
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    setNewTitle(displayTitle || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setNewTitle(displayTitle || "");
      setIsEditing(false);
    }
  };

  return (
    <div
      className={twMerge("relative flex items-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* LeftBarHideButton aligned to the left */}
      <div className="absolute left-1 top-3">
        <LeftBarHideButton className="border-none" />
      </div>
      <div className="absolute right-1 top-3">
        <RightBarHideButton className="border-none" />
      </div>

      {/* Title centered */}
      <div className="flex-1 text-center mt-2">
        {selectedNote && (
          <>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="inline-flex">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="bg-slate-700/80 text-white px-2 py-1 rounded outline-none border border-slate-500 text-center"
                />
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400">{displayTitle}</span>
                {isHovered && (
                  <button
                    onClick={handleEditClick}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="Rename note"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
