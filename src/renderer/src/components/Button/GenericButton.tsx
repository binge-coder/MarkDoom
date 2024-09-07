import { ComponentProps } from "react";

// Typing props for a button component
export const GenericButton = (props: ComponentProps<"button">) => {
  return (
    <button
      className="ring-stone-500 bg-stone-600 hover:bg-stone-700 hover:ring-[2px] active:bg-stone-600 active:ring-transparent transition-colors text-white/70 px-4 py-1 rounded mt-4"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
