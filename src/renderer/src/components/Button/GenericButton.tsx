import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

// Typing props for a button component
export const GenericButton = (props: ComponentProps<"button">) => {
  return (
    <button
      className={twMerge(
        "ring-slate-800/90 bg-slate-900/30 hover:bg-slate-600/30 hover:ring-[2px] active:bg-slate-900 active:ring-transparent transition-colors text-slate-200 px-4 py-1 rounded mt-4",
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
