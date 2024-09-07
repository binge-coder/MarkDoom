import React from "react";
import { IoMdClose } from "react-icons/io";

interface XbuttonProps {
  onClick: () => void;
}

export const Xbutton: React.FC<XbuttonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-stone-600 text-white/70 p-1 rounded hover:bg-stone-700 absolute top-2 right-2"
      onClick={onClick}
    >
      <IoMdClose className="w-4 h-4" />
    </button>
  );
};
