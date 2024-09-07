import { ComponentProps } from "react";

// Typing props for a button component
export const GenericButton = (props: ComponentProps<"button">) => {
  return (
    <button
      className="ring-slate-800/90 bg-slate-900/30 hover:bg-slate-800/30 hover:ring-[2px] active:bg-slate-900 active:ring-transparent transition-colors text-slate-200 px-4 py-1 rounded mt-4"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
