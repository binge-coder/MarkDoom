import { themeAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type ActionButtonProps = ComponentProps<"button">;

export const ActionButton = ({
  className,
  children,
  ...props
}: ActionButtonProps) => {
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  return (
    <button
      className={twMerge(
        isLightMode
          ? "px-4 py-3 rounded-md bg-slate-100/70 hover:bg-slate-200/90 active:bg-slate-300/80 transition-colors duration-100 text-slate-700"
          : "px-4 py-3 rounded-md bg-slate-950/40 hover:bg-slate-800 active:bg-slate-900 transition-colors duration-100 text-white/70",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
