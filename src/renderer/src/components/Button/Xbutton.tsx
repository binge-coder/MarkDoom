import React from "react";
import { IoMdClose } from "react-icons/io";

interface XbuttonProps {
  onClick: () => void;
}

export const Xbutton: React.FC<XbuttonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-neutral-800 text-white p-1 rounded hover:bg-neutral-600 absolute top-1 right-1"
      onClick={onClick}
    >
      <IoMdClose className="w-4 h-4" />
    </button>
  );
};
