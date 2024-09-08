import { selectedNoteAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { LeftBarHideButton } from "./Button";

export const FloatingNoteTitle = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  if (!selectedNote) return null;
  return (
    <div
      className={twMerge("relative flex items-center", className)}
      {...props}
    >
      {/* LeftBarHideButton aligned to the left */}
      <div className="absolute left-1 top-3">
        <LeftBarHideButton />
      </div>

      {/* Title centered */}
      <div className="flex-1 text-center">
        <span className="text-gray-700">{selectedNote.title}</span>
      </div>
    </div>
  );
};
