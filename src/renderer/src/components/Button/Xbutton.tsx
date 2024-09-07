import React from "react";
import { IoMdClose } from "react-icons/io";

interface XbuttonProps {
  onClick: () => void;
}

export const Xbutton: React.FC<XbuttonProps> = ({ onClick }) => {
  return (
    <button
      className="ring-slate-800/90 bg-slate-900/30 hover:bg-slate-800/30 hover:ring-[2px] text-slate-200 p-1 rounded absolute top-2 right-2 transition-colors duration-100"
      onClick={onClick}
    >
      <IoMdClose className="w-4 h-4" />
    </button>
  );
};
