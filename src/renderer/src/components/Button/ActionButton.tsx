import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type ActionButtonProps = ComponentProps<"button">;

export const ActionButton = ({
  className,
  children,
  ...props
}: ActionButtonProps) => {
  return (
    <button
      className={twMerge(
        "px-2 py-1 rounded-md border border-white/70 hover:bg-zinc-400/50 active:bg-zinc-400 transition-colors duration-100 text-white/70",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
