import { selectedNoteAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { LeftBarHideButton, RightBarHideButton } from "@/components";

export const FloatingNoteTitle = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  // if (!selectedNote) return null;
  return (
    <div
      className={twMerge("relative flex items-center", className)}
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
      <div className="flex-1 text-center">
        {selectedNote && (
          <span className="text-gray-400">{selectedNote.title}</span>
        )}
      </div>
    </div>
  );
};
