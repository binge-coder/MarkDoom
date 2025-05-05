import { PrimitiveAtom, useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type SidebarHideButtonProps = ComponentProps<"button"> & {
  stateAtom: PrimitiveAtom<boolean>;
  isRightSide?: boolean;
};

export const SidebarHideButton = ({
  stateAtom,
  isRightSide = false,
  className,
  children,
  ...props
}: SidebarHideButtonProps) => {
  const [showSideBar, setShowSideBar] = useAtom(stateAtom);

  return (
    <button
      onClick={() => {
        setShowSideBar(!showSideBar);
      }}
      className={twMerge(
        "px-2 py-1.5 rounded-md bg-slate-950/40 hover:bg-slate-800 active:bg-slate-900 transition-colors duration-100 text-white/70",
        className,
      )}
      {...props}
    >
      {isRightSide ? (
        showSideBar ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )
      ) : showSideBar ? (
        <ChevronLeft className="h-3.5 w-3.5" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5" />
      )}
    </button>
  );
};
