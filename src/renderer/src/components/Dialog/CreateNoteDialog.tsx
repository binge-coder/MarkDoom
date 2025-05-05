import { cn } from "@renderer/utils";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface CreateNoteDialogProps {
  isOpen: boolean;
  onConfirm: (noteName: string) => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  confirmButtonClass?: string;
}

export const CreateNoteDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Create New Note",
  confirmText = "Create",
  cancelText = "Cancel",
  placeholder = "Note name",
  confirmButtonClass = "bg-blue-500 hover:bg-blue-600",
}: CreateNoteDialogProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [noteName, setNoteName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Find the root element for the portal
  useEffect(() => {
    setPortalElement(document.getElementById("root") || document.body);
  }, []);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setNoteName("");
      setError(null);
      // Focus will be handled in a separate useEffect to ensure proper timing
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
    // Return empty function to satisfy TypeScript
    return () => {};
  }, [isOpen]);

  // Handle keyboard interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  // Focus input field on open
  useEffect(() => {
    if (isOpen && isVisible && inputRef.current) {
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, isVisible]);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trim whitespace
    const trimmedName = noteName.trim();

    // Basic validation
    if (!trimmedName) {
      setError("Note name cannot be empty");
      return;
    }

    // Check for invalid characters
    if (/[\\/:*?"<>|]/g.test(trimmedName)) {
      setError('Note name contains invalid characters: \\ / : * ? " < > |');
      return;
    }

    // Add .md extension if not present
    const finalName = trimmedName.endsWith(".md")
      ? trimmedName
      : `${trimmedName}.md`;

    onConfirm(finalName);
  };

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
        className="bg-slate-800 rounded-lg shadow-lg w-full max-w-md p-5 relative border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>

        <form onSubmit={validateAndSubmit}>
          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={noteName}
              onChange={(e) => {
                setNoteName(e.target.value);
                setError(null);
              }}
              placeholder={placeholder}
              className={cn(
                "w-full px-3 py-2.5 bg-slate-700/70 border rounded-lg text-slate-200",
                "focus:outline-none focus:ring-2 transition-colors",
                error
                  ? "border-red-500/70 focus:ring-red-500/50"
                  : "border-slate-600/50 focus:ring-blue-500/50",
              )}
              autoComplete="off"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className={cn(
                "px-3 py-2 rounded-md text-white transition-colors",
                confirmButtonClass,
              )}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  // Render the dialog content directly at the root level using createPortal
  return createPortal(dialogContent, portalElement);
};
