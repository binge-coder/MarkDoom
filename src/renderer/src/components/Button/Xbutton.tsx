import React from "react";
import { IoMdClose } from "react-icons/io";
import { twMerge } from "tailwind-merge";

interface XbuttonProps {
  onClick: () => void;
  className?: string;
}

export const Xbutton: React.FC<XbuttonProps> = ({ onClick, className }) => {
  return (
    <button
      className={twMerge(
        "ring-slate-800/90 bg-slate-900 hover:bg-slate-600/30 hover:ring-[2px] text-slate-200 p-1 rounded absolute top-2 right-2 transition-colors duration-100",
        className,
      )}
      onClick={onClick}
    >
      <IoMdClose className="w-4 h-4" />
    </button>
  );
};
