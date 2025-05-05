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
        "px-4 py-3 rounded-md bg-slate-950/40 hover:bg-slate-800 active:bg-slate-900 transition-colors duration-100 text-white/70",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
