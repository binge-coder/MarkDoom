import { renameNoteAtom } from "@renderer/store";
import { cn, formatDateFromMS } from "@renderer/utils";
import { NoteInfo } from "@shared/models";
import { useSetAtom } from "jotai";
import { Pencil } from "lucide-react";
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
  const renameNote = useSetAtom(renameNoteAtom);

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent note selection
    setIsEditing(true);
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
    <div
      className={cn(
        "cursor-pointer px-2 py-2 rounded-md transition-colors duration-75 ",
        {
          "bg-white/30": isActive,
          "hover:bg-gray-300/25": !isActive,
        },
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* <hr /> */}
      <div className="flex justify-between items-center mb-1">
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
              className="w-full bg-slate-700/80 text-white px-1 py-0.5 rounded outline-none border border-slate-500"
              onClick={(e) => e.stopPropagation()}
            />
          </form>
        ) : (
          <>
            <h3 className="font-bold truncate flex-grow">{displayTitle}</h3>
            {isHovered && (
              <button
                onClick={handleRenameClick}
                className="text-slate-400 hover:text-white transition-colors ml-1"
                aria-label="Rename note"
              >
                <Pencil size={14} />
              </button>
            )}
          </>
        )}
      </div>
      <span className="inline-block w-full mb-1 text-xs font-light text-right">
        {date}
      </span>
      <hr className="border border-slate-400" />
    </div>
  );
};
