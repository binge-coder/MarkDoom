import { NotePreview } from "@/components";
import { useNotesList } from "@/hooks/useNotesList";
import { selectedNoteIndexAtom, themeAtom } from "@/store";
import { cn } from "@renderer/utils";
import { NoteInfo } from "@shared/models";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { isEmpty } from "lodash";
import { FileText, Search, StickyNote, Folder } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export type NotePreviewListProps = ComponentProps<"div"> & {
  onSelect?: () => void;
};

export const NotePreviewList = ({
  onSelect,
  className,
  ...props
}: NotePreviewListProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({
    onSelect,
  });

  const [, setSelectedNoteIndex] = useAtom(selectedNoteIndexAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteInfo[] | null>(null);
  const [filteredIndices, setFilteredIndices] = useState<Map<number, number>>(
    new Map(),
  );
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  // Update filtered notes when search term changes
  useEffect(() => {
    if (!notes) {
      setFilteredNotes(null);
      setFilteredIndices(new Map());
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredNotes(notes);

      // When clearing the search, create a 1:1 mapping
      const newIndices = new Map();
      notes.forEach((_, index) => newIndices.set(index, index));
      setFilteredIndices(newIndices);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered: NoteInfo[] = [];
    const newIndices = new Map<number, number>();

    // Create filtered list and maintain mapping to original indices
    notes.forEach((note, originalIndex) => {
      const title = note.title.toLowerCase();
      if (title.includes(lowerCaseSearch)) {
        // Store the mapping: filteredIndex → originalIndex
        newIndices.set(filtered.length, originalIndex);
        filtered.push(note);
      }
    });

    setFilteredNotes(filtered);
    setFilteredIndices(newIndices);
  }, [notes, searchTerm]);

  // Create a wrapped version of handleNoteSelect to handle filtered indices
  const handleFilteredNoteSelect = (filteredIndex: number) => () => {
    // Convert filtered index to original index
    const originalIndex = filteredIndices.get(filteredIndex);

    if (originalIndex !== undefined) {
      // Use the original handleNoteSelect with the mapped index
      setSelectedNoteIndex(originalIndex);
      if (onSelect) {
        onSelect();
      }
    }
  };

  // This will render when no notes match the search
  const renderEmptySearchResults = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-6 text-center px-4"
    >
      <Search
        className={`${isLightMode ? "text-slate-500" : "text-slate-400"} mb-2 h-5 w-5`}
      />
      <p
        className={
          isLightMode ? "text-slate-700 text-sm" : "text-white text-sm"
        }
      >
        No notes found matching &quot;
        {searchTerm.replace(/</g, "&lt;").replace(/>/g, "&gt;")}&quot;
      </p>
    </motion.div>
  );

  // This will render when there are no notes at all
  const renderEmptyNotes = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8 text-center px-4"
    >
      <div
        className={
          isLightMode
            ? "bg-slate-200/70 p-4 rounded-full mb-3"
            : "bg-slate-700/70 p-4 rounded-full mb-3"
        }
      >
        <StickyNote
          className={
            isLightMode ? "text-slate-700 h-6 w-6" : "text-white h-6 w-6"
          }
        />
      </div>
      <p
        className={
          isLightMode
            ? "text-slate-800 font-medium mb-1"
            : "text-white font-medium mb-1"
        }
      >
        No notes yet
      </p>
      <p
        className={
          isLightMode ? "text-slate-600 text-sm" : "text-slate-300 text-sm"
        }
      >
        Create your first note to get started
      </p>
    </motion.div>
  );

  if (!notes) return null;

  return (
    <div className={twMerge("flex flex-col h-full", className)} {...props}>
      {/* Header with search - fixed at the top */}
      <div className="flex-shrink-0 sticky top-0 z-10 pb-2 pt-1 bg-inherit">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Folder
              className={
                isLightMode ? "h-4 w-4 text-slate-700" : "h-4 w-4 text-white"
              }
            />
            <h2
              className={
                isLightMode
                  ? "text-sm font-medium text-slate-800"
                  : "text-sm font-medium text-white"
              }
            >
              All Notes
            </h2>
          </div>
          <div
            className={
              isLightMode ? "text-xs text-slate-600" : "text-xs text-slate-300"
            }
          >
            {filteredNotes?.length || 0} notes
          </div>
        </div>

        {/* Search input styled like chat input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className={cn(
              "w-full text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none",
              "placeholder:text-slate-400/60",
              "focus:ring-1 focus:ring-blue-500/50",
              "transition-all duration-200 shadow-sm",
              isLightMode
                ? "bg-white/60 focus:bg-white text-slate-800 border border-slate-300/80 focus:border-blue-500/80"
                : "bg-slate-950/40 focus:bg-slate-900 text-white border border-slate-700/80 focus:border-blue-500/80",
            )}
          />
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isLightMode ? "text-slate-500" : "text-slate-400"
            }`}
          />
        </div>
      </div>

      {/* Notes list - scrollable */}
      <div className="overflow-y-auto overflow-x-hidden flex-1 space-y-2.5 pr-1 mt-2 min-h-0 pb-2">
        {isEmpty(notes)
          ? renderEmptyNotes()
          : isEmpty(filteredNotes)
            ? renderEmptySearchResults()
            : filteredNotes?.map((note, filteredIndex) => {
                // Find if this filtered note matches the selected note
                const originalIndex = filteredIndices.get(filteredIndex);
                const isActive = originalIndex === selectedNoteIndex;

                return (
                  <NotePreview
                    key={note.title}
                    isActive={isActive}
                    onClick={handleFilteredNoteSelect(filteredIndex)}
                    {...note}
                  />
                );
              })}
      </div>
    </div>
  );
};
