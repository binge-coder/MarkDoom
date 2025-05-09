import { themeAtom } from "@/store";
import { cn } from "@renderer/utils";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-500 hover:bg-red-600",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  // Find the root element for the portal
  useEffect(() => {
    setPortalElement(document.getElementById("root") || document.body);
  }, []);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      return undefined;
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle keyboard interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  // Focus confirm button on open
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isVisible || !portalElement) return null;

  const dialogContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "rounded-lg shadow-lg w-full max-w-md p-5 relative",
          isLightMode
            ? "bg-white border border-slate-200"
            : "bg-slate-800 border border-slate-700",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className={cn(
            "absolute top-3 right-3 p-1 rounded-full transition-colors",
            isLightMode
              ? "hover:bg-slate-200/80 text-slate-500 hover:text-slate-700"
              : "hover:bg-slate-700/50 text-slate-400 hover:text-slate-200",
          )}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3
          className={cn(
            "text-lg font-medium mb-2",
            isLightMode ? "text-slate-800" : "text-white",
          )}
        >
          {title}
        </h3>
        <p
          className={
            isLightMode ? "text-slate-600 mb-6" : "text-slate-300 mb-6"
          }
        >
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={cn(
              "px-3 py-2 rounded-md transition-colors",
              isLightMode
                ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200",
            )}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={cn(
              "px-3 py-2 rounded-md text-white transition-colors",
              confirmButtonClass,
            )}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );

  // Render the dialog content directly at the root level using createPortal
  return createPortal(dialogContent, portalElement);
};
