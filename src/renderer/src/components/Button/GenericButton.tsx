import { themeAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

// Typing props for a button component
export const GenericButton = (props: ComponentProps<"button">) => {
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  return (
    <button
      className={twMerge(
        isLightMode
          ? "ring-slate-300/90 bg-slate-200 hover:bg-slate-300/80 hover:ring-[2px] active:bg-slate-200 active:ring-transparent transition-colors text-slate-800 px-4 py-1 rounded h-9"
          : "ring-slate-800/90 bg-slate-900 hover:bg-slate-600/30 hover:ring-[2px] active:bg-slate-900 active:ring-transparent transition-colors text-slate-200 px-4 py-1 rounded h-9",
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
