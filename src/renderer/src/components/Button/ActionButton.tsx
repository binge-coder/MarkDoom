import { themeAtom } from "@renderer/store";
import { cn } from "@renderer/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";

export type ActionButtonProps = HTMLMotionProps<"button">;

export const ActionButton = ({
  className,
  children,
  ...props
}: ActionButtonProps) => {
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-4 py-3 rounded-lg transition-all duration-150",
        "shadow-sm",
        isLightMode
          ? "bg-white/70 hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800"
          : "bg-slate-950/40 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
