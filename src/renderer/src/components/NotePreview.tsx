import { NoteInfo } from "@shared/models";
import { ComponentProps } from "react";
import { cn, formatDateFromMS } from "@renderer/utils";
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
  return (
    <div
      className={cn(
        "cursor-pointer px-2 py-2 rounded-md transition-colors duration-75 ",
        {
          "bg-slate-50/50": isActive,
          "hover:bg-zinc-600/50": !isActive,
        },
        className,
      )}
      {...props}
    >
      {/* <hr /> */}
      <h3 className="font-bold mb-1 truncate">{title}</h3>
      <span className="inline-block w-full mb-1 text-xs font-light text-right">
        {date}
      </span>
      <hr className="border border-slate-800" />
    </div>
  );
};
