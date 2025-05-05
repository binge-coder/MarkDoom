import { motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { themeAtom } from "@renderer/store";
import { useAtomValue } from "jotai";

interface XbuttonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export const Xbutton: React.FC<XbuttonProps> = ({
  onClick,
  className,
  ariaLabel = "Close",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  return (
    <motion.button
      className={twMerge(
        isLightMode
          ? "group flex items-center justify-center bg-slate-200/60 hover:bg-slate-300 text-slate-600 hover:text-slate-800 p-1.5 rounded-full shadow-sm border border-slate-300/50 absolute top-2 right-2 transition-all duration-200"
          : "group flex items-center justify-center bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white p-1.5 rounded-full shadow-sm border border-slate-700/50 absolute top-2 right-2 transition-all duration-200",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <motion.div
        animate={{ rotate: isHovered ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <X
          className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
          strokeWidth={2.5}
        />
      </motion.div>
    </motion.button>
  );
};
